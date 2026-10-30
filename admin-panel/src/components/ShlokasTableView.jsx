import React from 'react';
import { 
  Edit3, 
  Trash2, 
  Sparkles, 
  Plus, 
  Filter, 
  RotateCcw,
  Tag,
  BookOpen
} from 'lucide-react';
import { useShlokas } from '../context/ShlokaContext';
import { SOURCES, MOOD_CATEGORIES } from '../data/seedShlokas';

export default function ShlokasTableView({ openEditModal, openAddModal }) {
  const { 
    filteredShlokas, 
    shlokas, 
    deleteShloka, 
    toggleViral,
    selectedSource, 
    setSelectedSource,
    selectedMood, 
    setSelectedMood,
    onlyViral,
    setOnlyViral,
    resetToOriginalSeed
  } = useShlokas();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Source Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Source Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#181B20] border border-[#2A2E37] rounded-xl overflow-x-auto">
          {SOURCES.map((source) => (
            <button
              key={source}
              onClick={() => setSelectedSource(source)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedSource === source
                  ? 'bg-[#E6C794] text-[#0D0F12] font-semibold shadow-sm'
                  : 'text-[#A1A8B3] hover:text-[#F5F5F7] hover:bg-[#22262E]'
              }`}
            >
              {source}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mood Filter */}
          <div className="relative">
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="bg-[#181B20] border border-[#2A2E37] text-xs text-[#F5F5F7] px-3 py-2 rounded-xl focus:outline-none focus:border-[#E6C794] transition-colors cursor-pointer"
            >
              <option value="all">All Emotional Moods</option>
              {MOOD_CATEGORIES.map((mood) => (
                <option key={mood.id} value={mood.id}>
                  {mood.icon} {mood.name} ({mood.hindi})
                </option>
              ))}
            </select>
          </div>

          {/* Viral Spotlight Toggle */}
          <button
            onClick={() => setOnlyViral(!onlyViral)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              onlyViral
                ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                : 'bg-[#181B20] border-[#2A2E37] text-[#A1A8B3] hover:text-[#F5F5F7]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Viral Only</span>
          </button>

          {/* Add New Shloka Button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E6C794] text-[#0D0F12] text-xs font-semibold rounded-xl hover:bg-[#D4B27B] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quote</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#181B20] border border-[#2A2E37] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A2E37] bg-[#121418] text-[11px] uppercase tracking-wider text-[#A1A8B3]">
                <th className="py-3.5 px-5">Source & Reference</th>
                <th className="py-3.5 px-5">Sacred Sanskrit / Verse</th>
                <th className="py-3.5 px-5">Hindi Meaning & Translation</th>
                <th className="py-3.5 px-5">Mood Tags</th>
                <th className="py-3.5 px-4 text-center">Viral</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2E37]/60 text-xs">
              {filteredShlokas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#A1A8B3]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <BookOpen className="w-8 h-8 text-[#E6C794]/40 mx-auto" />
                      <p className="font-medium text-[#F5F5F7]">No verses found matching your criteria</p>
                      <p className="text-[11px]">Try clearing search filters or add a new quote.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShlokas.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1E232B]/60 transition-colors group">
                    {/* Source & Reference */}
                    <td className="py-4 px-5 align-top whitespace-nowrap">
                      <div className="font-semibold text-[#F5F5F7]">{item.source}</div>
                      <div className="text-[11px] text-[#E6C794] font-medium mt-0.5">{item.section}</div>
                      <div className="text-[10px] text-[#6B7280] mt-1">{item.author}</div>
                    </td>

                    {/* Sanskrit Verse */}
                    <td className="py-4 px-5 align-top max-w-xs">
                      {item.sanskrit ? (
                        <p className="font-serif text-[#E6C794] leading-relaxed whitespace-pre-line text-[13px]">
                          {item.sanskrit}
                        </p>
                      ) : (
                        <span className="text-[11px] text-[#6B7280] italic">
                          (Modern Reflection &bull; No Sanskrit required)
                        </span>
                      )}
                    </td>

                    {/* Hindi Translation */}
                    <td className="py-4 px-5 align-top max-w-sm">
                      <p className="font-hindi text-[#F5F5F7]/90 leading-relaxed text-[13px]">
                        {item.hindi_meaning}
                      </p>
                    </td>

                    {/* Mood Tags */}
                    <td className="py-4 px-5 align-top">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {item.mood_tags?.map((tag) => {
                          const moodObj = MOOD_CATEGORIES.find((m) => m.id === tag);
                          return (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#121418] border border-[#2A2E37] text-[10px] text-[#A1A8B3]"
                            >
                              <span>{moodObj?.icon || '•'}</span>
                              <span>{moodObj?.name || tag}</span>
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Viral Spotlight Toggle */}
                    <td className="py-4 px-4 align-top text-center">
                      <button
                        onClick={() => toggleViral(item.id)}
                        title={item.is_viral ? "Remove from Viral Spotlight" : "Set as Viral Spotlight"}
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.is_viral
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-[#121418] border-[#2A2E37] text-[#6B7280] hover:text-[#A1A8B3]'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-[#121418] border border-[#2A2E37] text-[#A1A8B3] hover:text-[#E6C794] hover:border-[#E6C794]/50 transition-colors"
                          title="Edit Verse"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this verse?')) {
                              deleteShloka(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-[#121418] border border-[#2A2E37] text-[#A1A8B3] hover:text-red-400 hover:border-red-500/50 transition-colors"
                          title="Delete Verse"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#121418] border-t border-[#2A2E37] flex items-center justify-between text-xs text-[#A1A8B3]">
          <span>
            Showing <strong className="text-[#F5F5F7]">{filteredShlokas.length}</strong> of{' '}
            <strong className="text-[#F5F5F7]">{shlokas.length}</strong> total lines
          </span>

          <button
            onClick={() => {
              if (window.confirm('Reset all verses to the verified master seed dataset?')) {
                resetToOriginalSeed();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#E6C794] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Master Seed</span>
          </button>
        </div>
      </div>
    </div>
  );
}
