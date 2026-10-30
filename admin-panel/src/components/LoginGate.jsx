import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Shield, ShieldAlert, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginGate() {
  const { login, registerOwner, resetPassword, authError, isOwnerEmail, setAuthError } = useAuth();
  
  // Clean empty inputs - no pre-filled email or leaky placeholders
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customMsg, setCustomMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCustomMsg(null);
    setAuthError(null);

    const targetEmail = email.trim().toLowerCase();

    // Frontend cryptographic SHA-256 verification:
    // Rejects immediately on client side with ZERO network requests to Firebase if not owner
    const isOwner = await isOwnerEmail(targetEmail);
    if (!isOwner) {
      setIsLoading(false);
      setAuthError('Access Denied: Invalid credentials or unauthorized account.');
      return;
    }

    try {
      if (isRegisterMode) {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await registerOwner(targetEmail, password);
        setCustomMsg('Owner account established successfully! Entering console...');
      } else {
        await login(targetEmail, password);
      }
    } catch (err) {
      // error handled inside context or displayed
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Please enter your email address to receive password reset instructions.');
      return;
    }

    setIsLoading(true);
    setCustomMsg(null);
    setAuthError(null);

    const targetEmail = email.trim().toLowerCase();

    try {
      const isOwner = await isOwnerEmail(targetEmail);
      if (isOwner) {
        await resetPassword(targetEmail);
      }
      // Always show generic message to prevent user enumeration
      setCustomMsg('If this email matches the administrator account, a password reset link has been dispatched to your inbox.');
      setIsForgotMode(false);
    } catch (err) {
      setAuthError(err.message || 'Failed to dispatch reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0D0F12] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background ambient gold luxury glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E6C687]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#1C202A] rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-[#161920]/90 backdrop-blur-xl border border-[#262B36] rounded-3xl p-8 shadow-2xl shadow-black/80">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E6C687]/20 to-[#E6C687]/5 border border-[#E6C687]/40 mb-4 shadow-lg shadow-[#E6C687]/10">
            <Shield className="w-8 h-8 text-[#E6C687]" />
          </div>

          <h1 className="text-2xl font-bold tracking-widest text-[#F5F5F7] font-serif">
            SUTRA
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#E6C794] font-semibold mt-1">
            {isRegisterMode ? 'Setup Owner Credentials' : isForgotMode ? 'Password Recovery' : 'Admin Console'}
          </p>
          <p className="text-xs text-[#8E95A5] mt-2">
            Restricted access. Only the authorized administrator may sign in.
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{authError}</div>
          </div>
        )}

        {/* Success Alert */}
        {customMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{customMsg}</div>
          </div>
        )}

        {/* Forgot Password View */}
        {isForgotMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8E95A5] mb-1.5 uppercase tracking-wider">
                Administrator Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoFocus
                className="w-full bg-[#0D0F12] border border-[#262B36] focus:border-[#E6C794] rounded-xl px-4 py-3 text-sm text-[#F5F5F7] placeholder-[#4A5162] outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#E6C794] to-[#C9A96E] text-[#0D0F12] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E6C794]/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0D0F12] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(false);
                  setAuthError(null);
                  setCustomMsg(null);
                }}
                className="text-xs text-[#E6C794] hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          /* Sign In & Register Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8E95A5] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-[#0D0F12] border border-[#262B36] focus:border-[#E6C794] rounded-xl px-4 py-3 text-sm text-[#F5F5F7] placeholder-[#4A5162] outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#8E95A5] uppercase tracking-wider">
                  {isRegisterMode ? 'Create Password' : 'Password'}
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setAuthError(null);
                      setCustomMsg(null);
                    }}
                    className="text-xs text-[#E6C794] hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#0D0F12] border border-[#262B36] focus:border-[#E6C794] rounded-xl px-4 py-3 pr-11 text-sm text-[#F5F5F7] placeholder-[#4A5162] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E95A5] hover:text-[#F5F5F7] p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-medium text-[#8E95A5] mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#0D0F12] border border-[#262B36] focus:border-[#E6C794] rounded-xl px-4 py-3 text-sm text-[#F5F5F7] placeholder-[#4A5162] outline-none transition-colors"
                />
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#E6C794] to-[#C9A96E] text-[#0D0F12] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E6C794]/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0D0F12] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegisterMode ? 'Create Owner Account' : 'Enter Admin Console'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Mode Toggle */}
        {!isForgotMode && (
          <div className="mt-6 pt-6 border-t border-[#262B36] text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setAuthError(null);
                setCustomMsg(null);
              }}
              className="text-xs text-[#8E95A5] hover:text-[#E6C794] cursor-pointer transition-colors"
            >
              {isRegisterMode ? (
                <span>Already have your owner password? <strong className="text-[#E6C794]">Sign In</strong></span>
              ) : (
                <span>First time setting up owner credentials? <strong className="text-[#E6C794]">Click here</strong></span>
              )}
            </button>
          </div>
        )}

        {/* Security Watermark */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-[#4A5162] uppercase tracking-wider">
            <Lock className="w-3 h-3 text-[#E6C794]" />
            <span>End-to-End Firebase Auth &bull; 256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
