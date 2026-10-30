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

// Verified Master Owner Email
export const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || 'nitinjangra.dev@gmail.com').trim().toLowerCase();

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
        const userEmail = (currentUser.email || '').trim().toLowerCase();
        if (userEmail === OWNER_EMAIL) {
          setUser(currentUser);
          setAuthError(null);
        } else {
          // Immediately reject unauthorized visitors without leaking owner identity
          console.warn(`Unauthorized login attempt by: ${userEmail}. Enforcing owner-only isolation.`);
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

    // Strict client-side gate before even dispatching request (zero email leak)
    if (normalizedEmail !== OWNER_EMAIL) {
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

    if (normalizedEmail !== OWNER_EMAIL) {
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
    if (normalizedEmail !== OWNER_EMAIL) {
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
        ownerEmail: OWNER_EMAIL,
        isOwner: Boolean(user && user.email?.toLowerCase() === OWNER_EMAIL),
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
