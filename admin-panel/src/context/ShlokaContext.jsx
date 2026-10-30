import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SHLOKAS, MOOD_CATEGORIES } from '../data/seedShlokas';
import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ShlokaContext = createContext();

export const ShlokaProvider = ({ children }) => {
  // Load initial shlokas from localStorage or fall back to default seed
  const [shlokas, setShlokas] = useState(() => {
    const saved = localStorage.getItem('sutra_shlokas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing cached shlokas', e);
      }
    }
    return INITIAL_SHLOKAS;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(() => {
    return localStorage.getItem('sutra_has_unsaved_changes') === 'true';
  });

  const [publishedVersion, setPublishedVersion] = useState(() => {
    return localStorage.getItem('sutra_published_version') || '1.0';
  });

  // Filters & Search
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [selectedMood, setSelectedMood] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyViral, setOnlyViral] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sutra_shlokas', JSON.stringify(shlokas));
  }, [shlokas]);

  useEffect(() => {
    localStorage.setItem('sutra_has_unsaved_changes', hasUnsavedChanges.toString());
  }, [hasUnsavedChanges]);

  // CRUD Operations
  const addShloka = (newShloka) => {
    const entry = {
      ...newShloka,
      id: newShloka.id || `custom_${Date.now()}`,
      likes_count: 0,
      created_at: new Date().toISOString()
    };
    setShlokas((prev) => [entry, ...prev]);
    setHasUnsavedChanges(true);
    return entry;
  };

  const updateShloka = (id, updatedFields) => {
    setShlokas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    setHasUnsavedChanges(true);
  };

  const deleteShloka = (id) => {
    setShlokas((prev) => prev.filter((item) => item.id !== id));
    setHasUnsavedChanges(true);
  };

  const toggleViral = (id) => {
    setShlokas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_viral: !item.is_viral } : item))
    );
    setHasUnsavedChanges(true);
  };

  const resetToOriginalSeed = () => {
    setShlokas(INITIAL_SHLOKAS);
    setHasUnsavedChanges(true);
  };

  // Compile Zero-Read Mood Packs
  const generatePackedBundles = (nextVersion) => {
    const bundles = {};
    const versionsMetadata = {
      last_updated_at: new Date().toISOString()
    };

    MOOD_CATEGORIES.forEach((mood) => {
      const filtered = shlokas.filter((item) =>
        item.mood_tags && item.mood_tags.includes(mood.id)
      );

      bundles[mood.id] = {
        category_id: mood.id,
        display_title_hindi: mood.hindi,
        display_title_english: mood.name,
        version: nextVersion,
        total_count: filtered.length,
        updated_at: new Date().toISOString(),
        shlokas: filtered
      };

      versionsMetadata[`${mood.id}_version`] = nextVersion;
    });

    return { bundles, versionsMetadata };
  };

  // Publish & Sync Handler
  const publishAndSync = async () => {
    const currentNum = parseFloat(publishedVersion) || 1.0;
    const nextVersion = (currentNum + 0.1).toFixed(1);

    const { bundles, versionsMetadata } = generatePackedBundles(nextVersion);

    // If Firebase is active and configured, write directly to Firestore
    if (isFirebaseConfigured && db) {
      try {
        // 1. Write versions metadata document
        await setDoc(doc(db, 'system_metadata', 'versions'), versionsMetadata);

        // 2. Write each packed mood document
        for (const [moodId, bundleData] of Object.entries(bundles)) {
          await setDoc(doc(db, 'mood_packs', moodId), bundleData);
        }
      } catch (err) {
        console.error('Firebase publish error:', err);
        throw err;
      }
    }

    // Save state locally
    setPublishedVersion(nextVersion);
    localStorage.setItem('sutra_published_version', nextVersion);
    setHasUnsavedChanges(false);

    return {
      nextVersion,
      bundles,
      versionsMetadata
    };
  };

  // Filtered List
  const filteredShlokas = shlokas.filter((item) => {
    const matchesSource =
      selectedSource === 'All Sources' || item.source === selectedSource;
    const matchesMood =
      selectedMood === 'all' || (item.mood_tags && item.mood_tags.includes(selectedMood));
    const matchesViral = !onlyViral || item.is_viral === true;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (item.sanskrit && item.sanskrit.toLowerCase().includes(query)) ||
      (item.hindi_meaning && item.hindi_meaning.toLowerCase().includes(query)) ||
      (item.section && item.section.toLowerCase().includes(query)) ||
      (item.author && item.author.toLowerCase().includes(query));

    return matchesSource && matchesMood && matchesViral && matchesSearch;
  });

  return (
    <ShlokaContext.Provider
      value={{
        shlokas,
        filteredShlokas,
        addShloka,
        updateShloka,
        deleteShloka,
        toggleViral,
        resetToOriginalSeed,
        publishAndSync,
        hasUnsavedChanges,
        publishedVersion,
        selectedSource,
        setSelectedSource,
        selectedMood,
        setSelectedMood,
        searchQuery,
        setSearchQuery,
        onlyViral,
        setOnlyViral,
        generatePackedBundles
      }}
    >
      {children}
    </ShlokaContext.Provider>
  );
};

export const useShlokas = () => useContext(ShlokaContext);
