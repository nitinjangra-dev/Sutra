import React from 'react';
import { Search, CloudUpload, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShlokas } from '../context/ShlokaContext';

export default function Header({ currentView, openPublishModal }) {
  const { searchQuery, setSearchQuery, hasUnsavedChanges } = useShlokas();

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

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-[#A1A8B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Hindi, Sanskrit, chapter or source..."
            className="w-full pl-10 pr-4 py-2 bg-[#181B20] border border-[#2A2E37] rounded-xl text-sm text-[#F5F5F7] placeholder-[#6B7280] focus:outline-none focus:border-[#E6C794] transition-colors"
          />
        </div>

        {/* Publish & Sync Button */}
        <button
          onClick={openPublishModal}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            hasUnsavedChanges
              ? 'bg-[#E6C794] text-[#0D0F12] hover:bg-[#D4B27B] animate-pulse'
              : 'bg-[#181B20] border border-[#2A2E37] text-[#A1A8B3] hover:text-[#F5F5F7]'
          }`}
        >
          {hasUnsavedChanges ? (
            <>
              <CloudUpload className="w-4 h-4 text-[#0D0F12]" />
              <span>Publish & Sync App</span>
              <span className="w-2 h-2 rounded-full bg-red-600" />
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>App In Sync</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
