import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SHLOKAS, MOOD_CATEGORIES } from '../data/seedShlokas';
import { CURATED_WALLPAPERS } from '../data/curatedWallpapers';
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

export const RECOMMENDED_FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sutra Mobile App: public read for scripture verses, mood packs & wallpapers
    // Sutra Admin Console: read and write for authenticated administrator
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;

export const RECOMMENDED_STORAGE_RULES = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Sutra Mobile App: public read for wallpapers
    // Sutra Admin Console: upload for authenticated administrator
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;

const ShlokaContext = createContext();

export const ShlokaProvider = ({ children }) => {
  // Live state from Firestore
  const [shlokas, setShlokas] = useState([]);
  const [wallpapers, setWallpapers] = useState([]);
  const [isLoadingFirestore, setIsLoadingFirestore] = useState(true);
  const [isLoadingWallpapers, setIsLoadingWallpapers] = useState(true);
  const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false);
  const [isWallpapersEmpty, setIsWallpapersEmpty] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [firestoreError, setFirestoreError] = useState(null);
  const [connectionHealth, setConnectionHealth] = useState('checking'); // 'checking' | 'connected' | 'permission_denied' | 'empty' | 'offline'

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

  const generatePackedBundles = (nextVersion) => {
    return generatePackedBundlesFromList(shlokas, nextVersion);
  };

  // Load actual live shlokas and wallpapers from Firestore
  const loadFromFirestore = async () => {
    if (!isFirebaseConfigured || !db) {
      setConnectionHealth('offline');
      setIsLoadingFirestore(false);
      setIsLoadingWallpapers(false);
      setIsDatabaseEmpty(true);
      setIsWallpapersEmpty(true);
      return;
    }

    setIsLoadingFirestore(true);
    setIsLoadingWallpapers(true);
    setFirestoreError(null);
    setConnectionHealth('checking');

    try {
      // 1. Fetch live scripture verses from 'shlokas' collection
      const querySnapshot = await getDocs(collection(db, 'shlokas'));
      const items = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (items.length > 0) {
        setShlokas(items);
        setIsDatabaseEmpty(false);
        setConnectionHealth('connected');
        localStorage.setItem('sutra_shlokas', JSON.stringify(items));
      } else {
        // Fallback: check if mood_packs has documents from previous publish
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
          setConnectionHealth('connected');
          localStorage.setItem('sutra_shlokas', JSON.stringify(extracted));
        } else {
          setShlokas([]);
          setIsDatabaseEmpty(true);
          setConnectionHealth('empty');
          localStorage.removeItem('sutra_shlokas');
        }
      }

      // 2. Fetch live wallpapers from 'wallpapers' collection
      try {
        const wpSnapshot = await getDocs(collection(db, 'wallpapers'));
        const wpItems = [];
        wpSnapshot.forEach((docSnap) => {
          wpItems.push({ id: docSnap.id, ...docSnap.data() });
        });
        setWallpapers(wpItems);
        setIsWallpapersEmpty(wpItems.length === 0);
      } catch (wpErr) {
        console.warn('Error reading wallpapers collection:', wpErr);
        setWallpapers([]);
        setIsWallpapersEmpty(true);
      }

      // 3. Fetch live version from system_metadata
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
      const isPermissionErr =
        err.code === 'permission-denied' ||
        (err.message && err.message.toLowerCase().includes('permission'));

      if (isPermissionErr) {
        setConnectionHealth('permission_denied');
        setFirestoreError('Missing or insufficient permissions. Cloud Firestore Security Rules are currently blocking reads and writes.');
      } else {
        setConnectionHealth('offline');
        setFirestoreError(err.message || 'Failed to connect to Cloud Firestore.');
      }

      setShlokas([]);
      setWallpapers([]);
      setIsDatabaseEmpty(true);
      setIsWallpapersEmpty(true);
    } finally {
      setIsLoadingFirestore(false);
      setIsLoadingWallpapers(false);
    }
  };

  useEffect(() => {
    loadFromFirestore();
  }, []);

  // Quick live connection tester
  const testFirestoreConnection = async () => {
    return await loadFromFirestore();
  };

  // Seed all verified Sacred Shlokas & Curated Wallpapers into Cloud Firestore (1-Click Fill)
  const seedDatabaseToFirestore = async () => {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase is not configured or offline.');
    }

    setIsSeeding(true);
    setFirestoreError(null);

    try {
      // 1. Write shlokas
      const batch = writeBatch(db);
      INITIAL_SHLOKAS.forEach((item) => {
        const docRef = doc(db, 'shlokas', item.id);
        batch.set(docRef, {
          ...item,
          created_at: item.created_at || new Date().toISOString()
        });
      });

      // 2. Write curated wallpapers
      CURATED_WALLPAPERS.forEach((wp) => {
        const wpRef = doc(db, 'wallpapers', wp.id);
        batch.set(wpRef, {
          ...wp,
          created_at: new Date().toISOString()
        });
      });

      await batch.commit();

      // 3. Compile and write mood_packs and system_metadata/versions
      const nextVersion = publishedVersion || '1.0';
      const { bundles, versionsMetadata } = generatePackedBundlesFromList(INITIAL_SHLOKAS, nextVersion);

      await setDoc(doc(db, 'system_metadata', 'versions'), versionsMetadata);
      for (const [moodId, bundleData] of Object.entries(bundles)) {
        await setDoc(doc(db, 'mood_packs', moodId), bundleData);
      }

      // 4. Update live state
      setShlokas(INITIAL_SHLOKAS);
      setWallpapers(CURATED_WALLPAPERS);
      setIsDatabaseEmpty(false);
      setIsWallpapersEmpty(false);
      setHasUnsavedChanges(false);
      setConnectionHealth('connected');
      localStorage.setItem('sutra_shlokas', JSON.stringify(INITIAL_SHLOKAS));

      return {
        shlokasCount: INITIAL_SHLOKAS.length,
        wallpapersCount: CURATED_WALLPAPERS.length
      };
    } catch (err) {
      console.error('Error seeding Firestore:', err);
      const isPermissionErr =
        err.code === 'permission-denied' ||
        (err.message && err.message.toLowerCase().includes('permission'));

      if (isPermissionErr) {
        setConnectionHealth('permission_denied');
        setFirestoreError('Missing or insufficient permissions. Please update Cloud Firestore Security Rules in Firebase Console to allow write access.');
      } else {
        setFirestoreError(err.message || 'Failed to seed Firestore');
      }
      throw err;
    } finally {
      setIsSeeding(false);
    }
  };

  // Seed ONLY wallpapers to Firestore
  const seedWallpapersToFirestore = async () => {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase is not configured or offline.');
    }

    const batch = writeBatch(db);
    CURATED_WALLPAPERS.forEach((wp) => {
      const wpRef = doc(db, 'wallpapers', wp.id);
      batch.set(wpRef, {
        ...wp,
        created_at: new Date().toISOString()
      });
    });
    await batch.commit();
    setWallpapers(CURATED_WALLPAPERS);
    setIsWallpapersEmpty(false);
    return CURATED_WALLPAPERS.length;
  };

  // Add a new wallpaper to Firestore
  const addWallpaper = async (newWp) => {
    const entry = {
      ...newWp,
      id: newWp.id || `custom_wp_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'wallpapers', entry.id), entry);
    }

    setWallpapers((prev) => [entry, ...prev]);
    setIsWallpapersEmpty(false);
    return entry;
  };

  // Delete a wallpaper from Firestore
  const deleteWallpaper = async (id) => {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'wallpapers', id));
    }
    setWallpapers((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      if (updated.length === 0) setIsWallpapersEmpty(true);
      return updated;
    });
  };

  // CRUD Operations for Shlokas with Firestore sync
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
        await setDoc(doc(db, 'system_metadata', 'versions'), versionsMetadata);

        for (const [moodId, bundleData] of Object.entries(bundles)) {
          await setDoc(doc(db, 'mood_packs', moodId), bundleData);
        }

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
        wallpapers,
        isLoadingFirestore,
        isLoadingWallpapers,
        isDatabaseEmpty,
        isWallpapersEmpty,
        isSeeding,
        firestoreError,
        connectionHealth,
        testFirestoreConnection,
        loadFromFirestore,
        seedDatabaseToFirestore,
        seedWallpapersToFirestore,
        addWallpaper,
        deleteWallpaper,
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
