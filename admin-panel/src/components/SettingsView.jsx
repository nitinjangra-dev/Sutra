import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Sparkles, 
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Copy,
  ExternalLink,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { firebaseConfig, isFirebaseConfigured } from '../firebase/config';
import { useShlokas, RECOMMENDED_FIRESTORE_RULES, RECOMMENDED_STORAGE_RULES } from '../context/ShlokaContext';

export default function SettingsView() {
  const { 
    shlokas, 
    wallpapers,
    seedDatabaseToFirestore, 
    seedWallpapersToFirestore,
    loadFromFirestore,
    isLoadingFirestore,
    isSeeding,
    connectionHealth,
    firestoreError,
    publishedVersion,
    testFirestoreConnection
  } = useShlokas();

  // Local Form state for Firebase config
  const [apiKey, setApiKey] = useState(firebaseConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(firebaseConfig.authDomain || '');
  const [projectId, setProjectId] = useState(firebaseConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(firebaseConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(firebaseConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(firebaseConfig.appId || '');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState(null);
  const [copiedRules, setCopiedRules] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [isPinging, setIsPinging] = useState(false);
  const [activeRuleTab, setActiveRuleTab] = useState('firestore'); // 'firestore' | 'storage'

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const config = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    localStorage.setItem('sutra_firebase_config', JSON.stringify(config));
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleClearConfig = () => {
    if (window.confirm('Disconnect Firebase and return to local sandbox mode?')) {
      localStorage.removeItem('sutra_firebase_config');
      window.location.reload();
    }
  };

  const handleCopyRules = () => {
    navigator.clipboard.writeText(RECOMMENDED_FIRESTORE_RULES);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 3000);
  };

  const handlePingTest = async () => {
    setIsPinging(true);
    setPingResult(null);
    const start = performance.now();
    try {
      await testFirestoreConnection();
      const elapsed = Math.round(performance.now() - start);
      if (connectionHealth === 'permission_denied') {
        setPingResult({ success: false, msg: `Ping responded in ${elapsed}ms: Denied by Firestore Security Rules.` });
      } else {
        setPingResult({ success: true, msg: `Ping successful in ${elapsed}ms: Live connection confirmed.` });
      }
    } catch (err) {
      setPingResult({ success: false, msg: `Ping failed: ${err.message}` });
    } finally {
      setIsPinging(false);
      setTimeout(() => setPingResult(null), 6000);
    }
  };

  const handleSeedAll = async () => {
    try {
      setSeedSuccessMsg(null);
      const res = await seedDatabaseToFirestore();
      setSeedSuccessMsg(`Successfully wrote ${res.shlokasCount} verses and ${res.wallpapersCount} wallpapers to Cloud Firestore!`);
      setTimeout(() => setSeedSuccessMsg(null), 6000);
    } catch (err) {
      alert(`Seeding failed: ${err.message}`);
    }
  };

  const handleSeedWallpapersOnly = async () => {
    try {
      setSeedSuccessMsg(null);
      const count = await seedWallpapersToFirestore();
      setSeedSuccessMsg(`Successfully saved ${count} Curated Wallpapers to Cloud Firestore!`);
      setTimeout(() => setSeedSuccessMsg(null), 6000);
    } catch (err) {
      alert(`Seeding wallpapers failed: ${err.message}`);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Real-time Connection Health Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        connectionHealth === 'connected'
          ? 'bg-[#181B20] border-emerald-500/40 shadow-emerald-950/20 shadow-xl'
          : connectionHealth === 'permission_denied'
          ? 'bg-rose-950/40 border-rose-500/50 shadow-rose-950/30 shadow-xl'
          : connectionHealth === 'empty'
          ? 'bg-[#181B20] border-amber-500/40'
          : 'bg-[#181B20] border-[#2A2E37]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              connectionHealth === 'connected'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : connectionHealth === 'permission_denied'
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
            }`}>
              {connectionHealth === 'connected' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : connectionHealth === 'permission_denied' ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <Database className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-[#F5F5F7]">Live Database Connection Health</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                  connectionHealth === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : connectionHealth === 'permission_denied'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {connectionHealth === 'connected'
                    ? 'Live & Authenticated'
                    : connectionHealth === 'permission_denied'
                    ? 'Rules Denied'
                    : connectionHealth === 'empty'
                    ? 'Connected (Empty)'
                    : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-[#A1A8B3] mt-1">
                Project: <code className="text-[#E6C794] font-mono">{projectId}</code> &bull; Auth Domain: <code className="text-[#A1A8B3] font-mono">{authDomain}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePingTest}
              disabled={isPinging}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121418] border border-[#2A2E37] hover:border-[#E6C794] text-xs font-semibold text-[#F5F5F7] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#E6C794]' : ''}`} />
              <span>{isPinging ? 'Pinging Firestore...' : 'Test Live Connection Ping'}</span>
            </button>
          </div>
        </div>

        {pingResult && (
          <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
            pingResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {pingResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
            <span>{pingResult.msg}</span>
          </div>
        )}
      </div>

      {/* Security Rules Action Box (When permissions are blocked or to review rules) */}
      {(connectionHealth === 'permission_denied' || isFirebaseConfigured) && (
        <div className={`p-6 rounded-3xl bg-[#181B20] border space-y-4 ${
          connectionHealth === 'permission_denied' ? 'border-rose-500/50' : 'border-[#2A2E37]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-[#F5F5F7]">
                {connectionHealth === 'permission_denied' ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-300">Action Required: Cloud Firestore Security Rules Denying Access</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Firebase Security Rules Reference</span>
                  </>
                )}
              </h4>
              <p className="text-xs text-[#A1A8B3] leading-relaxed">
                {connectionHealth === 'permission_denied'
                  ? 'Your database is rejecting queries with "Missing or insufficient permissions". Publish the recommended rules below in Firebase Console to enable read/write:'
                  : 'Rules that ensure mobile app users can read scripture & wallpapers while only authenticated administrators can write:'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={
                  activeRuleTab === 'firestore'
                    ? `https://console.firebase.google.com/project/${projectId}/firestore/rules`
                    : `https://console.firebase.google.com/project/${projectId}/storage/rules`
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-200 border border-rose-500/40 transition-colors"
              >
                <span>Open {activeRuleTab === 'firestore' ? 'Firestore' : 'Storage'} Rules</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Rule Selection Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#121418] border border-[#2A2E37] rounded-xl w-fit">
            <button
              onClick={() => setActiveRuleTab('firestore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeRuleTab === 'firestore'
                  ? 'bg-[#E6C794] text-[#0D0F12] font-semibold'
                  : 'text-[#A1A8B3] hover:text-white'
              }`}
            >
              Firestore Database Rules
            </button>
            <button
              onClick={() => setActiveRuleTab('storage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeRuleTab === 'storage'
                  ? 'bg-[#E6C794] text-[#0D0F12] font-semibold'
                  : 'text-[#A1A8B3] hover:text-white'
              }`}
            >
              Cloud Storage Rules (Wallpapers)
            </button>
          </div>

          <div className="relative rounded-2xl bg-[#0D0F12] border border-[#2A2E37] p-4 text-xs font-mono text-[#E6C794] overflow-x-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2A2E37]/60 text-[11px] text-[#A1A8B3]">
              <span>
                Paste into Firebase Console &gt; {activeRuleTab === 'firestore' ? 'Firestore Database' : 'Storage'} &gt; Rules:
              </span>
              <button
                onClick={() => {
                  const textToCopy = activeRuleTab === 'firestore' ? RECOMMENDED_FIRESTORE_RULES : RECOMMENDED_STORAGE_RULES;
                  navigator.clipboard.writeText(textToCopy);
                  setCopiedRules(true);
                  setTimeout(() => setCopiedRules(false), 3000);
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#1E232B] hover:bg-[#2A2E37] text-white rounded-lg transition-colors cursor-pointer"
              >
                {copiedRules ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy {activeRuleTab === 'firestore' ? 'Firestore' : 'Storage'} Rules</span>
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre">
              {activeRuleTab === 'firestore' ? RECOMMENDED_FIRESTORE_RULES : RECOMMENDED_STORAGE_RULES}
            </pre>
          </div>
        </div>
      )}

      {/* Cloud Firestore Actual Inventory Card */}
      <div className="p-6 rounded-3xl bg-[#181B20] border border-[#2A2E37] space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2E37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6C794]/10 border border-[#E6C794]/30 flex items-center justify-center text-[#E6C794]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#F5F5F7]">Cloud Firestore Actual Inventory</h3>
              <p className="text-xs text-[#A1A8B3]">Verified documents currently living in project <strong className="text-white">{projectId}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {shlokas.length} Verses &bull; {wallpapers.length} Wallpapers
            </span>
          </div>
        </div>

        {seedSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{seedSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">Scripture Verses</span>
            <div className="text-2xl font-bold font-mono text-[#F5F5F7]">{shlokas.length}</div>
            <p className="text-[10px] text-[#A1A8B3]">Collection: <code className="text-[#E6C794]">shlokas</code></p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">4K Wallpapers</span>
            <div className="text-2xl font-bold font-mono text-[#F5F5F7]">{wallpapers.length}</div>
            <p className="text-[10px] text-[#A1A8B3]">Collection: <code className="text-[#E6C794]">wallpapers</code></p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">App Release Sync</span>
            <div className="text-2xl font-bold font-mono text-[#E6C794]">v{publishedVersion}</div>
            <p className="text-[10px] text-[#A1A8B3]">Metadata: <code className="text-[#E6C794]">system_metadata/versions</code></p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedAll}
            disabled={isSeeding}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E6C794] text-[#0D0F12] text-xs font-semibold hover:bg-[#D4B27B] transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#0D0F12]" />
            <span>{isSeeding ? 'Writing to Firestore...' : 'Seed Entire Database (Verses + Wallpapers)'}</span>
          </button>

          {wallpapers.length === 0 && (
            <button
              onClick={handleSeedWallpapersOnly}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181B20] border border-[#2A2E37] hover:border-[#E6C794] text-xs font-medium text-[#F5F5F7] transition-all cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#E6C794]" />
              <span>Seed Curated Wallpapers Only</span>
            </button>
          )}

          <button
            onClick={loadFromFirestore}
            disabled={isLoadingFirestore}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121418] border border-[#2A2E37] text-xs font-medium text-[#F5F5F7] hover:border-[#E6C794] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFirestore ? 'animate-spin text-[#E6C794]' : ''}`} />
            <span>Refresh from Cloud Firestore</span>
          </button>
        </div>
      </div>

      {/* Firebase Credentials Configuration Form */}
      <div className="p-6 rounded-3xl bg-[#181B20] border border-[#2A2E37] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2E37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6C794]/10 border border-[#E6C794]/30 flex items-center justify-center text-[#E6C794]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#F5F5F7]">Firebase Project Credentials</h3>
              <p className="text-xs text-[#A1A8B3]">Active API keys and service endpoints</p>
            </div>
          </div>

          <span className="text-xs text-[#8E95A5] font-mono">
            daily-slok.firebaseapp.com
          </span>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 text-center font-medium">
            Firebase configuration saved! Reloading portal to initialize cloud connection...
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                Project ID
              </label>
              <input
                type="text"
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="e.g. daily-slok"
                className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                API Key
              </label>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="daily-slok.firebaseapp.com"
                className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                Storage Bucket
              </label>
              <input
                type="text"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                placeholder="daily-slok.firebasestorage.app"
                className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={messagingSenderId}
                onChange={(e) => setMessagingSenderId(e.target.value)}
                placeholder="417216826909"
                className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                App ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:417216826909:web:..."
                className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#2A2E37]">
            {isFirebaseConfigured ? (
              <button
                type="button"
                onClick={handleClearConfig}
                className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
              >
                Disconnect Firebase
              </button>
            ) : <div />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#E6C794] text-[#0D0F12] hover:bg-[#D4B27B] transition-all shadow-md cursor-pointer"
            >
              Save & Connect Firebase
            </button>
          </div>
        </form>
      </div>

      {/* Architecture & Quota Efficiency Monitor */}
      <div className="p-6 rounded-3xl bg-[#181B20] border border-[#2A2E37] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#F5F5F7]">Database Quota & Scale Architecture</h3>
            <p className="text-xs text-[#A1A8B3]">Zero-read client caching design for the Sutra mobile application</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">Spark Plan Free Tier</span>
            <div className="text-xl font-bold font-mono text-[#F5F5F7]">50,000 Reads / Day</div>
            <p className="text-[10px] text-emerald-400">$0.00 / Month Free Tier</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">Client Cache Strategy</span>
            <div className="text-xl font-bold font-mono text-[#E6C794]">Zero Lockscreen Reads</div>
            <p className="text-[10px] text-[#A1A8B3]">Mobile app only reads on new release publish</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">Packed Mood Bundles</span>
            <div className="text-xl font-bold font-mono text-emerald-400">Single Document Reads</div>
            <p className="text-[10px] text-[#A1A8B3]">Collection: <code className="text-[#E6C794]">mood_packs</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
