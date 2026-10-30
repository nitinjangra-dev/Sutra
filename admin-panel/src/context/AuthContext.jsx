import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext();

// Cryptographic one-way SHA-256 hash of the authorized master owner email.
// The plaintext email is NEVER stored or disclosed anywhere in the frontend code or build bundle.
export const OWNER_EMAIL_HASH = (
  import.meta.env.VITE_OWNER_EMAIL_HASH ||
  'a81957532b4d60bf74ae73f94816aaaacc355b0407da1c3bc65a289cf222571e'
).trim().toLowerCase();

/**
 * Computes the SHA-256 hex digest for an input string using standard Web Crypto API.
 */
export async function hashEmail(email) {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized) return '';
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return '';
}

/**
 * Verifies if an email matches the owner hash without revealing the owner email in plaintext.
 */
export async function isOwnerEmail(email) {
  const hash = await hashEmail(email);
  return Boolean(hash && hash === OWNER_EMAIL_HASH);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const isOwner = await isOwnerEmail(currentUser.email);
        if (isOwner) {
          setUser(currentUser);
          setAuthError(null);
        } else {
          // Immediately reject unauthorized visitors
          console.warn('Unauthorized login attempt detected. Enforcing owner-only isolation.');
          await signOut(auth);
          setUser(null);
          setAuthError('Access Denied: Unauthorized account. Only the authorized administrator has access.');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Strict client-side gate before dispatching any request to Firebase
    const isOwner = await isOwnerEmail(normalizedEmail);
    if (!isOwner) {
      const err = new Error('Access Denied: Invalid credentials or unauthorized account.');
      setAuthError(err.message);
      throw err;
    }

    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please verify configuration.');
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      setUser(credential.user);
      return credential.user;
    } catch (err) {
      console.error('Login error:', err);
      let userFriendlyMessage = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        userFriendlyMessage = 'Invalid email or password. If this is your first time, please set up your password below.';
      } else if (err.code === 'auth/wrong-password') {
        userFriendlyMessage = 'Incorrect password. Please verify and try again.';
      } else if (err.code === 'auth/too-many-requests') {
        userFriendlyMessage = 'Too many failed login attempts. Please wait a few minutes or reset your password.';
      }
      setAuthError(userFriendlyMessage);
      throw new Error(userFriendlyMessage);
    }
  };

  const registerOwner = async (email, password) => {
    setAuthError(null);
    const normalizedEmail = (email || '').trim().toLowerCase();

    const isOwner = await isOwnerEmail(normalizedEmail);
    if (!isOwner) {
      const err = new Error('Registration Forbidden: Only the authorized administrator can create an account.');
      setAuthError(err.message);
      throw err;
    }

    if (!auth) {
      throw new Error('Firebase Auth is not initialized.');
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      setUser(credential.user);
      return credential.user;
    } catch (err) {
      console.error('Owner registration error:', err);
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Owner account is already registered! Please sign in with your password.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setAuthError(null);
  };

  const resetPassword = async (email) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const isOwner = await isOwnerEmail(normalizedEmail);
    if (!isOwner) {
      throw new Error('Access Denied: Invalid email address for password reset.');
    }
    if (!auth) throw new Error('Firebase Auth not available.');
    await sendPasswordResetEmail(auth, normalizedEmail);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isOwnerEmail,
        isOwner: Boolean(user && user.email),
        login,
        registerOwner,
        logout,
        resetPassword,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
