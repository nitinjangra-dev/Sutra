import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Check for user-provided Firebase configuration via environment variables or local storage
const getFirebaseConfig = () => {
  const localSavedConfig = localStorage.getItem('sutra_firebase_config');
  if (localSavedConfig) {
    try {
      return JSON.parse(localSavedConfig);
    } catch (e) {
      console.error('Invalid saved Firebase config', e);
    }
  }

  // Env vars take priority (set these in Netlify Dashboard → Site Settings → Environment Variables)
  // Fallback values ensure the app works even if env vars are not configured on the deploy platform
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyAAaM-aGwj-cHJyqMMn7_PQ6xrOju6BoI0",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "daily-slok.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "daily-slok",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "daily-slok.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "417216826909",
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:417216826909:web:5ceae9aed85fc8426840f4",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-362FVRZST5"
  };
};

export const firebaseConfig = getFirebaseConfig();

// Verify whether Firebase has valid credentials
export const isFirebaseConfigured = Boolean(
  firebaseConfig.projectId && firebaseConfig.apiKey && firebaseConfig.projectId !== ''
);

let app = null;
let db = null;
let auth = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization failed, falling back to local sandbox:', error);
  }
}

export { app, db, auth, storage };
