import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { firebaseConfig, isFirebaseConfigured } from '../firebase/config';
import { useShlokas } from '../context/ShlokaContext';

export default function SettingsView() {
  const { 
    shlokas, 
    seedDatabaseToFirestore, 
    loadFromFirestore,
    isLoadingFirestore,
    isSeeding 
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

  const handleSeedToFirestore = async () => {
    try {
      setSeedSuccessMsg(null);
      const count = await seedDatabaseToFirestore();
      setSeedSuccessMsg(`Successfully written ${count} scripture verses to Cloud Firestore!`);
      setTimeout(() => setSeedSuccessMsg(null), 5000);
    } catch (err) {
      alert(`Seeding failed: ${err.message}`);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Cloud Firestore Data Management Card */}
      <div className="p-6 rounded-3xl bg-[#181B20] border border-[#2A2E37] space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2E37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6C794]/10 border border-[#E6C794]/30 flex items-center justify-center text-[#E6C794]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#F5F5F7]">Cloud Firestore Data Manager</h3>
              <p className="text-xs text-[#A1A8B3]">Seed, sync, and inspect actual scripture verses in project <strong className="text-white">daily-slok</strong></p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            shlokas.length > 0
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {shlokas.length} Verses in Firestore
          </span>
        </div>

        {seedSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{seedSuccessMsg}</span>
          </div>
        )}

        <p className="text-xs text-[#A1A8B3] leading-relaxed">
          {shlokas.length === 0
            ? "Your Firestore database currently has no documents. Click 'Seed All Sacred Verses' below to immediately fill Firestore with verified verses from Bhagavad Gita, Hanuman Chalisa, Ramcharitmanas, and modern viral thoughts."
            : `Your Cloud Firestore currently holds ${shlokas.length} live scripture verses. Edits, additions, and deletions made in this admin panel update Cloud Firestore in real time.`}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedToFirestore}
            disabled={isSeeding}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E6C794] text-[#0D0F12] text-xs font-semibold hover:bg-[#D4B27B] transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#0D0F12]" />
            <span>{isSeeding ? 'Writing to Firestore...' : 'Seed / Re-seed All Sacred Verses to Firestore'}</span>
          </button>

          <button
            onClick={loadFromFirestore}
            disabled={isLoadingFirestore}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121418] border border-[#2A2E37] text-xs font-medium text-[#F5F5F7] hover:border-[#E6C794] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFirestore ? 'animate-spin text-[#E6C794]' : ''}`} />
            <span>Refresh Data from Firestore</span>
          </button>
        </div>
      </div>

      {/* Firebase Connection Card */}
      <div className="p-6 rounded-3xl bg-[#181B20] border border-[#2A2E37] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2E37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6C794]/10 border border-[#E6C794]/30 flex items-center justify-center text-[#E6C794]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#F5F5F7]">Firebase Project Connection</h3>
              <p className="text-xs text-[#A1A8B3]">Active project credentials and configuration parameters</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isFirebaseConfigured ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span>Sandbox Mode (Local)</span>
              </span>
            )}
          </div>
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

      {/* Database Read Calculator & Cost Optimizer */}
      <div className="p-6 rounded-3xl bg-[#181B20] border border-[#2A2E37] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#F5F5F7]">Firebase Quota & Optimization Calculator</h3>
            <p className="text-xs text-[#A1A8B3]">How Sutra achieves 100% free scale on 50k reads / day</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">Firebase Free Tier</span>
            <div className="text-xl font-bold font-mono text-[#F5F5F7]">50,000 Reads/Day</div>
            <p className="text-[10px] text-emerald-400">$0.00 / Month Spark Plan</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">Consumption Per User</span>
            <div className="text-xl font-bold font-mono text-[#E6C794]">~0.1 Reads/Day</div>
            <p className="text-[10px] text-[#A1A8B3]">Cached 100-pack per mood</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3]">Supported Active Users</span>
            <div className="text-xl font-bold font-mono text-emerald-400">Up to 500,000 DAU</div>
            <p className="text-[10px] text-[#A1A8B3]">Zero Firestore read cost on lockscreen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
