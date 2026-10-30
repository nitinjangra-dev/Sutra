import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Flame, 
  Heart, 
  Smartphone, 
  RefreshCw, 
  PlusCircle, 
  TrendingUp, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useShlokas } from '../context/ShlokaContext';
import { MOOD_CATEGORIES } from '../data/seedShlokas';
import { CURATED_WALLPAPERS } from '../data/curatedWallpapers';

export default function DashboardView({ setCurrentView, openAddModal }) {
  const { shlokas, setSelectedMood, setSelectedSource, setOnlyViral } = useShlokas();

  // Metrics calculation
  const totalCount = shlokas.length;
  const gitaCount = shlokas.filter((s) => s.source === 'Bhagavad Gita').length;
  const chalisaCount = shlokas.filter((s) => s.source === 'Hanuman Chalisa').length;
  const ramayanaCount = shlokas.filter((s) => s.source === 'Ramcharitmanas').length;
  const viralCount = shlokas.filter((s) => s.is_viral === true).length;

  // Simulator State
  const [activeWallpaperIndex, setActiveWallpaperIndex] = useState(0);
  const [activeShlokaIndex, setActiveShlokaIndex] = useState(0);

  const activeWallpaper = CURATED_WALLPAPERS[activeWallpaperIndex] || CURATED_WALLPAPERS[0];
  const activeShloka = shlokas[activeShlokaIndex] || shlokas[0];

  const handleNextSimulatorQuote = () => {
    setActiveShlokaIndex((prev) => (prev + 1) % shlokas.length);
  };

  const handleNextWallpaper = () => {
    setActiveWallpaperIndex((prev) => (prev + 1) % CURATED_WALLPAPERS.length);
  };

  const handleNavigateToSource = (sourceName) => {
    setSelectedSource(sourceName);
    setCurrentView('shlokas');
  };

  const handleNavigateToMood = (moodId) => {
    setSelectedMood(moodId);
    setCurrentView('shlokas');
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Quotes */}
        <div className="p-5 rounded-2xl bg-[#181B20] border border-[#2A2E37] flex flex-col justify-between hover:border-[#E6C794]/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#A1A8B3]">
            <span className="text-xs uppercase tracking-wider font-medium">Total Wisdom</span>
            <BookOpen className="w-4 h-4 text-[#E6C794]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#F5F5F7]">{totalCount}</span>
            <p className="text-xs text-[#A1A8B3] mt-1">Pre-loaded & verified</p>
          </div>
        </div>

        {/* Gita Verses */}
        <div 
          onClick={() => handleNavigateToSource('Bhagavad Gita')}
          className="p-5 rounded-2xl bg-[#181B20] border border-[#2A2E37] flex flex-col justify-between hover:border-[#E6C794] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#A1A8B3]">
            <span className="text-xs uppercase tracking-wider font-medium">Bhagavad Gita</span>
            <span className="text-sm">🦚</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#F5F5F7] group-hover:text-[#E6C794] transition-colors">{gitaCount}</span>
            <p className="text-xs text-[#A1A8B3] mt-1">Sacred Shlokas</p>
          </div>
        </div>

        {/* Hanuman Chalisa */}
        <div 
          onClick={() => handleNavigateToSource('Hanuman Chalisa')}
          className="p-5 rounded-2xl bg-[#181B20] border border-[#2A2E37] flex flex-col justify-between hover:border-[#E6C794] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#A1A8B3]">
            <span className="text-xs uppercase tracking-wider font-medium">Hanuman Chalisa</span>
            <span className="text-sm">🔱</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#F5F5F7] group-hover:text-[#E6C794] transition-colors">{chalisaCount}</span>
            <p className="text-xs text-[#A1A8B3] mt-1">Chaupais & Dohas</p>
          </div>
        </div>

        {/* Ramcharitmanas */}
        <div 
          onClick={() => handleNavigateToSource('Ramcharitmanas')}
          className="p-5 rounded-2xl bg-[#181B20] border border-[#2A2E37] flex flex-col justify-between hover:border-[#E6C794] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#A1A8B3]">
            <span className="text-xs uppercase tracking-wider font-medium">Ramcharitmanas</span>
            <span className="text-sm">🏹</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#F5F5F7] group-hover:text-[#E6C794] transition-colors">{ramayanaCount}</span>
            <p className="text-xs text-[#A1A8B3] mt-1">Epic Reflections</p>
          </div>
        </div>

        {/* Viral Wisdom */}
        <div 
          onClick={() => {
            setOnlyViral(true);
            setCurrentView('shlokas');
          }}
          className="p-5 rounded-2xl bg-[#181B20] border border-[#2A2E37] flex flex-col justify-between hover:border-[#E6C794] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#A1A8B3]">
            <span className="text-xs uppercase tracking-wider font-medium">Viral Quotes</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono text-[#F5F5F7] group-hover:text-[#E6C794] transition-colors">{viralCount}</span>
            <p className="text-xs text-amber-400/80 mt-1">Spotlight & Stories</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Mood Distribution & Phone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Mood Categorization Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#181B20] border border-[#2A2E37] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-[#F5F5F7]">Emotional Mood Distribution</h3>
                <p className="text-xs text-[#A1A8B3]">How wisdom is partitioned for user state matching</p>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1F242C] border border-[#E6C794]/40 text-[#E6C794] hover:bg-[#E6C794] hover:text-[#0D0F12] transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Quote</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {MOOD_CATEGORIES.map((mood) => {
                const count = shlokas.filter(
                  (s) => s.mood_tags && s.mood_tags.includes(mood.id)
                ).length;
                const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

                return (
                  <div
                    key={mood.id}
                    onClick={() => handleNavigateToMood(mood.id)}
                    className="p-3.5 rounded-xl bg-[#121418] border border-[#2A2E37]/60 hover:border-[#E6C794]/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{mood.icon}</span>
                        <div>
                          <span className="text-sm font-medium text-[#F5F5F7] group-hover:text-[#E6C794] transition-colors">
                            {mood.name}
                          </span>
                          <span className="text-xs text-[#A1A8B3] ml-2">({mood.hindi})</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-medium text-[#E6C794]">
                        {count} verses ({percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#1F232B] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E6C794] to-[#B39359] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Database Optimization Notice */}
          <div className="p-5 rounded-2xl bg-[#181B20] border border-[#2A2E37] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F5F5F7]">Zero-Read Pre-Caching Enabled</h4>
                <p className="text-xs text-[#A1A8B3]">
                  All {totalCount} quotes are packed into single category documents. Users load 100 quotes per single read.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              500k Free Users Capacity
            </span>
          </div>
        </div>

        {/* Right Column: Live Lock Screen Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#181B20] border border-[#2A2E37]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#E6C794]" />
                <h3 className="font-semibold text-sm text-[#F5F5F7]">Lock Screen Simulator</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextWallpaper}
                  title="Change Wallpaper"
                  className="px-2.5 py-1 rounded-lg text-xs bg-[#1F242C] border border-[#2A2E37] text-[#A1A8B3] hover:text-[#F5F5F7]"
                >
                  Change Texture
                </button>
                <button
                  onClick={handleNextSimulatorQuote}
                  title="Next Quote"
                  className="p-1 rounded-lg bg-[#1F242C] border border-[#2A2E37] text-[#E6C794] hover:bg-[#E6C794] hover:text-[#0D0F12]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="relative mx-auto w-72 h-[500px] rounded-[36px] border-4 border-[#2A2E37] overflow-hidden shadow-2xl bg-black">
              {/* Wallpaper Background */}
              <img
                src={activeWallpaper.url}
                alt={activeWallpaper.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7]"
              />

              {/* Status Bar */}
              <div className="absolute top-0 inset-x-0 h-8 px-6 flex items-center justify-between text-[11px] text-white/80 z-10 font-mono">
                <span>06:30</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Date & Time Header */}
              <div className="absolute top-12 inset-x-0 text-center text-white/90 z-10">
                <p className="text-xs font-medium tracking-wide">Thursday, October 29</p>
                <h2 className="text-4xl font-extralight tracking-tight mt-0.5">06:30</h2>
              </div>

              {/* Sutra Wisdom Widget Overlay */}
              <div className="absolute inset-x-4 top-36 z-10">
                <div className="p-4 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white shadow-xl space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px] text-white/70">
                    <span className="font-serif tracking-wider text-[#E6C794]">SUTRA WISDOM</span>
                    <span>{activeShloka?.source || 'Sacred Reflection'}</span>
                  </div>

                  {/* Sanskrit (if present) */}
                  {activeShloka?.sanskrit && (
                    <p className="text-[12px] font-serif leading-relaxed text-center text-[#E6C794] font-medium whitespace-pre-line">
                      "{activeShloka.sanskrit}"
                    </p>
                  )}

                  {/* Hindi Meaning */}
                  <p className="text-[12px] leading-relaxed text-center font-hindi text-white/95">
                    {activeShloka?.hindi_meaning}
                  </p>

                  <div className="text-[9px] text-center text-white/50 pt-1">
                    {activeShloka?.section || ''} &bull; {activeShloka?.author || ''}
                  </div>
                </div>
              </div>

              {/* Bottom Unlock Swipe Indicator */}
              <div className="absolute bottom-4 inset-x-0 text-center z-10">
                <div className="w-28 h-1 bg-white/40 rounded-full mx-auto" />
                <p className="text-[10px] text-white/60 mt-1.5">Swipe up to unlock</p>
              </div>
            </div>

            <p className="text-[11px] text-center text-[#6B7280] mt-3">
              Texture: {activeWallpaper.title} &bull; Tap reload to test next verse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
