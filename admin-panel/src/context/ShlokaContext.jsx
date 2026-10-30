import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SHLOKAS, MOOD_CATEGORIES } from '../data/seedShlokas';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';

const ShlokaContext = createContext();

export const ShlokaProvider = ({ children }) => {
  // Live state from Firestore
  const [shlokas, setShlokas] = useState([]);
  const [isLoadingFirestore, setIsLoadingFirestore] = useState(true);
  const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [firestoreError, setFirestoreError] = useState(null);

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

  // Helper to compile zero-read mood packs from any list
  const generatePackedBundlesFromList = (list, nextVersion) => {
    const bundles = {};
    const versionsMetadata = {
      last_updated_at: new Date().toISOString()
    };

    MOOD_CATEGORIES.forEach((mood) => {
      const filtered = list.filter((item) =>
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

  // Compile Zero-Read Mood Packs for current shlokas
  const generatePackedBundles = (nextVersion) => {
    return generatePackedBundlesFromList(shlokas, nextVersion);
  };

  // Load actual live data from Firestore on mount
  const loadFromFirestore = async () => {
    if (!isFirebaseConfigured || !db) {
      // Local fallback if Firebase not configured
      const saved = localStorage.getItem('sutra_shlokas');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setShlokas(parsed);
          setIsDatabaseEmpty(parsed.length === 0);
        } catch (e) {
          setShlokas([]);
          setIsDatabaseEmpty(true);
        }
      } else {
        setShlokas([]);
        setIsDatabaseEmpty(true);
      }
      setIsLoadingFirestore(false);
      return;
    }

    setIsLoadingFirestore(true);
    setFirestoreError(null);

    try {
      // 1. Fetch from 'shlokas' collection
      const querySnapshot = await getDocs(collection(db, 'shlokas'));
      const items = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (items.length > 0) {
        // Items exist in Firestore
        setShlokas(items);
        setIsDatabaseEmpty(false);
        localStorage.setItem('sutra_shlokas', JSON.stringify(items));
      } else {
        // Fallback: check if mood_packs has documents from a previous publish
        const moodSnapshot = await getDocs(collection(db, 'mood_packs'));
        const moodItemsMap = new Map();
        moodSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && Array.isArray(data.shlokas)) {
            data.shlokas.forEach((s) => moodItemsMap.set(s.id, s));
          }
        });

        if (moodItemsMap.size > 0) {
          const extracted = Array.from(moodItemsMap.values());
          setShlokas(extracted);
          setIsDatabaseEmpty(false);
          localStorage.setItem('sutra_shlokas', JSON.stringify(extracted));
        } else {
          // FIRESTORE IS TRULY EMPTY!
          setShlokas([]);
          setIsDatabaseEmpty(true);
          localStorage.removeItem('sutra_shlokas');
        }
      }

      // 2. Fetch live version from system_metadata
      try {
        const verDoc = await getDoc(doc(db, 'system_metadata', 'versions'));
        if (verDoc.exists()) {
          const vData = verDoc.data();
          const ver = vData.demotivated_version || vData.last_version || '1.0';
          setPublishedVersion(ver.toString());
          localStorage.setItem('sutra_published_version', ver.toString());
        }
      } catch (e) {
        console.warn('Could not read versions metadata', e);
      }
    } catch (err) {
      console.warn('Firestore load failed:', err);
      setFirestoreError(err.message || 'Failed to load from Firestore');

      // Fall back to local cache if available
      const saved = localStorage.getItem('sutra_shlokas');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setShlokas(parsed);
            setIsDatabaseEmpty(false);
          }
        } catch (e) {}
      }
    } finally {
      setIsLoadingFirestore(false);
    }
  };

  useEffect(() => {
    loadFromFirestore();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (shlokas.length > 0) {
      localStorage.setItem('sutra_shlokas', JSON.stringify(shlokas));
    }
  }, [shlokas]);

  useEffect(() => {
    localStorage.setItem('sutra_has_unsaved_changes', hasUnsavedChanges.toString());
  }, [hasUnsavedChanges]);

  // Seed all verified Sacred Shlokas into Cloud Firestore (1-Click Fill)
  const seedDatabaseToFirestore = async () => {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase is not configured or offline.');
    }

    setIsSeeding(true);
    setFirestoreError(null);

    try {
      // 1. Write each initial shloka into 'shlokas' collection using batch
      const batch = writeBatch(db);
      INITIAL_SHLOKAS.forEach((item) => {
        const docRef = doc(db, 'shlokas', item.id);
        batch.set(docRef, {
          ...item,
          created_at: item.created_at || new Date().toISOString()
        });
      });
      await batch.commit();

      // 2. Compile and write mood_packs and system_metadata/versions
      const nextVersion = publishedVersion || '1.0';
      const { bundles, versionsMetadata } = generatePackedBundlesFromList(INITIAL_SHLOKAS, nextVersion);

      await setDoc(doc(db, 'system_metadata', 'versions'), versionsMetadata);
      for (const [moodId, bundleData] of Object.entries(bundles)) {
        await setDoc(doc(db, 'mood_packs', moodId), bundleData);
      }

      // 3. Update state
      setShlokas(INITIAL_SHLOKAS);
      setIsDatabaseEmpty(false);
      setHasUnsavedChanges(false);
      localStorage.setItem('sutra_shlokas', JSON.stringify(INITIAL_SHLOKAS));
      return INITIAL_SHLOKAS.length;
    } catch (err) {
      console.error('Error seeding Firestore:', err);
      setFirestoreError(err.message || 'Failed to seed Firestore');
      throw err;
    } finally {
      setIsSeeding(false);
    }
  };

  // CRUD Operations with instant Firestore sync
  const addShloka = async (newShloka) => {
    const entry = {
      ...newShloka,
      id: newShloka.id || `custom_${Date.now()}`,
      likes_count: 0,
      created_at: new Date().toISOString()
    };

    setShlokas((prev) => [entry, ...prev]);
    setIsDatabaseEmpty(false);
    setHasUnsavedChanges(true);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'shlokas', entry.id), entry);
      } catch (err) {
        console.error('Error saving new shloka to Firestore:', err);
      }
    }

    return entry;
  };

  const updateShloka = async (id, updatedFields) => {
    setShlokas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    setHasUnsavedChanges(true);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'shlokas', id), updatedFields, { merge: true });
      } catch (err) {
        console.error('Error updating shloka in Firestore:', err);
      }
    }
  };

  const deleteShloka = async (id) => {
    setShlokas((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length === 0) setIsDatabaseEmpty(true);
      return updated;
    });
    setHasUnsavedChanges(true);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'shlokas', id));
      } catch (err) {
        console.error('Error deleting shloka from Firestore:', err);
      }
    }
  };

  const toggleViral = async (id) => {
    const target = shlokas.find((item) => item.id === id);
    const updatedViral = target ? !target.is_viral : false;

    setShlokas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_viral: updatedViral } : item))
    );
    setHasUnsavedChanges(true);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'shlokas', id), { is_viral: updatedViral }, { merge: true });
      } catch (err) {
        console.error('Error updating viral flag in Firestore:', err);
      }
    }
  };

  const resetToOriginalSeed = async () => {
    await seedDatabaseToFirestore();
  };

  // Publish & Sync Handler (Packs zero-read bundles for mobile app)
  const publishAndSync = async () => {
    const currentNum = parseFloat(publishedVersion) || 1.0;
    const nextVersion = (currentNum + 0.1).toFixed(1);

    const { bundles, versionsMetadata } = generatePackedBundles(nextVersion);

    if (isFirebaseConfigured && db) {
      try {
        // 1. Write versions metadata document
        await setDoc(doc(db, 'system_metadata', 'versions'), versionsMetadata);

        // 2. Write each packed mood document
        for (const [moodId, bundleData] of Object.entries(bundles)) {
          await setDoc(doc(db, 'mood_packs', moodId), bundleData);
        }

        // 3. Ensure all individual shlokas are committed
        if (shlokas.length > 0) {
          const batch = writeBatch(db);
          shlokas.forEach((item) => {
            batch.set(doc(db, 'shlokas', item.id), item, { merge: true });
          });
          await batch.commit();
        }
      } catch (err) {
        console.error('Firebase publish error:', err);
        throw err;
      }
    }

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
        isLoadingFirestore,
        isDatabaseEmpty,
        isSeeding,
        firestoreError,
        loadFromFirestore,
        seedDatabaseToFirestore,
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
