import React from 'react';
import { Search, CloudUpload, CheckCircle2, RefreshCw, Database, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useShlokas } from '../context/ShlokaContext';

export default function Header({ currentView, openPublishModal }) {
  const { 
    searchQuery, 
    setSearchQuery, 
    hasUnsavedChanges, 
    shlokas, 
    wallpapers,
    isLoadingFirestore,
    isDatabaseEmpty,
    connectionHealth,
    firestoreError,
    loadFromFirestore 
  } = useShlokas();

  const titles = {
    dashboard: 'System Overview & Analytics',
    shlokas: 'Sacred Verses & Modern Quotes Repository',
    wallpapers: 'Curated 4K Wallpaper Library',
    settings: 'Firebase Configuration & Database Optimization'
  };

  return (
    <header className="h-20 bg-[#121418]/80 backdrop-blur-md border-b border-[#2A2E37] px-8 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-xl font-semibold text-[#F5F5F7] tracking-tight">
          {titles[currentView] || 'Sutra Admin Portal'}
        </h2>
        <p className="text-xs text-[#A1A8B3] mt-0.5">
          Pre-loaded spiritual wisdom engine & lockscreen synchronizer
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Firestore Live Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181B20] border border-[#2A2E37] text-xs">
          <Database className="w-3.5 h-3.5 text-[#E6C794]" />
          {isLoadingFirestore ? (
            <span className="text-[#A1A8B3] flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin text-[#E6C794]" />
              <span>Checking...</span>
            </span>
          ) : connectionHealth === 'permission_denied' ? (
            <span className="text-rose-400 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Rules Blocked</span>
            </span>
          ) : connectionHealth === 'offline' ? (
            <span className="text-rose-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Offline</span>
            </span>
          ) : shlokas.length === 0 ? (
            <span className="text-amber-400 font-medium">Firestore: 0 (Empty)</span>
          ) : (
            <span className="text-emerald-400 font-medium">
              Firestore: {shlokas.length} Verses &bull; {wallpapers.length} Wallpapers
            </span>
          )}
          <button
            onClick={loadFromFirestore}
            disabled={isLoadingFirestore}
            title="Refresh from Firestore"
            className="text-[#6B7280] hover:text-[#E6C794] ml-1 p-0.5 rounded cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingFirestore ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-[#A1A8B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verses, chapters or moods..."
            className="w-full pl-10 pr-4 py-2 bg-[#181B20] border border-[#2A2E37] rounded-xl text-xs text-[#F5F5F7] placeholder-[#6B7280] focus:outline-none focus:border-[#E6C794] transition-colors"
          />
        </div>

        {/* Publish & Sync Button */}
        <button
          onClick={openPublishModal}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${
            connectionHealth === 'permission_denied'
              ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
              : hasUnsavedChanges
              ? 'bg-[#E6C794] text-[#0D0F12] hover:bg-[#D4B27B] animate-pulse'
              : shlokas.length === 0
              ? 'bg-[#181B20] border border-amber-500/30 text-amber-300'
              : 'bg-[#181B20] border border-[#2A2E37] text-[#A1A8B3] hover:text-[#F5F5F7]'
          }`}
        >
          {connectionHealth === 'permission_denied' ? (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Permission Blocked</span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <CloudUpload className="w-4 h-4 text-[#0D0F12]" />
              <span>Publish & Sync App</span>
              <span className="w-2 h-2 rounded-full bg-red-600" />
            </>
          ) : shlokas.length === 0 ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Database Empty</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Database Synced</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
