import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Shield, ShieldAlert, KeyRound, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginGate() {
  const { login, registerOwner, resetPassword, authError, ownerEmail, setAuthError } = useAuth();
  const [email, setEmail] = useState(ownerEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [customMsg, setCustomMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCustomMsg(null);

    const targetEmail = email.trim().toLowerCase();

    // Enforce immediate owner gate
    if (targetEmail !== ownerEmail) {
      setIsLoading(false);
      setAuthError(`⛔ ACCESS DENIED: Only the verified owner (${ownerEmail}) has permission to access this administrative portal.`);
      return;
    }

    try {
      if (isRegisterMode) {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await registerOwner(targetEmail, password);
        setCustomMsg('Master Owner account successfully created! Entering console...');
      } else {
        await login(targetEmail, password);
      }
    } catch (err) {
      // error handled inside context or displayed
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || email.trim().toLowerCase() !== ownerEmail) {
      setAuthError(`Password reset instructions can only be sent to the verified owner (${ownerEmail}).`);
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
      setCustomMsg(`Password reset link sent to ${ownerEmail}. Please check your inbox.`);
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

      {/* Master Login Card */}
      <div className="relative w-full max-w-md bg-[#161920]/90 backdrop-blur-xl border border-[#262B36] rounded-3xl p-8 shadow-2xl shadow-black/80">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E6C687]/20 to-[#E6C687]/5 border border-[#E6C687]/40 mb-4 shadow-lg shadow-[#E6C687]/10">
            <Shield className="w-8 h-8 text-[#E6C687]" />
          </div>

          <h1 className="text-2xl font-bold tracking-widest text-[#F5F5F7] font-serif">
            SUTRA
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#E6C687] font-semibold mt-1">
            Master Owner Access Console
          </p>
          <p className="text-xs text-[#8E95A5] mt-2">
            Restricted environment. Unauthorized access is forbidden and blocked by policy.
          </p>
        </div>

        {/* Owner Whitelist Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-[#0D0F12] border border-[#262B36] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8E95A5] tracking-wider block">
                Whitelisted Owner Identity
              </span>
              <span className="text-xs font-mono font-medium text-[#E6C687]">
                {ownerEmail}
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E6C687]/15 text-[#E6C687] border border-[#E6C687]/30">
            Enforced
          </span>
        </div>

        {/* Alerts */}
        {authError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-shake">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{authError}</div>
          </div>
        )}

        {customMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{customMsg}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8E95A5] mb-1.5 uppercase tracking-wider">
              Owner Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ownerEmail}
                required
                className="w-full bg-[#0D0F12] border border-[#262B36] focus:border-[#E6C687] rounded-xl px-4 py-3 text-sm text-[#F5F5F7] placeholder-[#4A5162] outline-none transition-colors"
              />
              {email.trim().toLowerCase() === ownerEmail && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Owner</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#8E95A5] uppercase tracking-wider">
                {isRegisterMode ? 'Choose Master Password' : 'Owner Password'}
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#E6C687] hover:underline cursor-pointer"
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
                className="w-full bg-[#0D0F12] border border-[#262B36] focus:border-[#E6C687] rounded-xl px-4 py-3 pr-11 text-sm text-[#F5F5F7] placeholder-[#4A5162] outline-none transition-colors"
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
                Confirm Master Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#0D0F12] border border-[#262B36] focus:border-[#E6C687] rounded-xl px-4 py-3 text-sm text-[#F5F5F7] placeholder-[#4A5162] outline-none transition-colors"
              />
            </div>
          )}

          {/* Action CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#E6C687] to-[#C9A96E] text-[#0D0F12] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E6C687]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#0D0F12] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegisterMode ? 'Establish Master Password' : 'Enter Admin Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 pt-6 border-t border-[#262B36] text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setCustomMsg(null);
            }}
            className="text-xs text-[#8E95A5] hover:text-[#E6C687] cursor-pointer transition-colors"
          >
            {isRegisterMode ? (
              <span>Already set your master password? <strong className="text-[#E6C687]">Sign In</strong></span>
            ) : (
              <span>First time setting up your owner password? <strong className="text-[#E6C687]">Click here</strong></span>
            )}
          </button>
        </div>

        {/* Security watermark */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-[#4A5162] uppercase tracking-wider">
            <Lock className="w-3 h-3 text-[#E6C687]" />
            <span>End-to-End Firebase Auth &bull; Netlify Edge Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
