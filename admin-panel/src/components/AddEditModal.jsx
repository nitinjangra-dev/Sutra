import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, Check, Feather } from 'lucide-react';
import { useShlokas } from '../context/ShlokaContext';
import { MOOD_CATEGORIES, SOURCES } from '../data/seedShlokas';

export default function AddEditModal({ isOpen, onClose, editingItem }) {
  const { addShloka, updateShloka } = useShlokas();

  const isEditing = Boolean(editingItem);

  const [categoryType, setCategoryType] = useState('scripture'); // 'scripture' | 'viral_wisdom'
  const [source, setSource] = useState('Bhagavad Gita');
  const [section, setSection] = useState('');
  const [author, setAuthor] = useState('भगवान श्रीकृष्ण');
  const [sanskrit, setSanskrit] = useState('');
  const [hindiMeaning, setHindiMeaning] = useState('');
  const [moodTags, setMoodTags] = useState(['demotivated']);
  const [isViral, setIsViral] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setCategoryType(editingItem.category || (editingItem.sanskrit ? 'scripture' : 'viral_wisdom'));
      setSource(editingItem.source || 'Bhagavad Gita');
      setSection(editingItem.section || '');
      setAuthor(editingItem.author || '');
      setSanskrit(editingItem.sanskrit || '');
      setHindiMeaning(editingItem.hindi_meaning || '');
      setMoodTags(editingItem.mood_tags || ['demotivated']);
      setIsViral(editingItem.is_viral || false);
    } else {
      // Reset defaults
      setCategoryType('scripture');
      setSource('Bhagavad Gita');
      setSection('अध्याय 2, श्लोक 47');
      setAuthor('भगवान श्रीकृष्ण');
      setSanskrit('');
      setHindiMeaning('');
      setMoodTags(['demotivated']);
      setIsViral(false);
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const toggleMoodTag = (tagId) => {
    if (moodTags.includes(tagId)) {
      if (moodTags.length > 1) {
        setMoodTags(moodTags.filter((t) => t !== tagId));
      }
    } else {
      setMoodTags([...moodTags, tagId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hindiMeaning.trim()) {
      alert('Please provide the Hindi meaning or quote text.');
      return;
    }

    const payload = {
      source,
      section,
      author,
      sanskrit: categoryType === 'scripture' ? sanskrit : '',
      hindi_meaning: hindiMeaning,
      category: categoryType,
      mood_tags: moodTags,
      is_viral: isViral
    };

    if (isEditing) {
      updateShloka(editingItem.id, payload);
    } else {
      addShloka(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181B20] border border-[#2A2E37] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#2A2E37] flex items-center justify-between bg-[#121418]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6C794]/10 border border-[#E6C794]/30 flex items-center justify-center text-[#E6C794]">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#F5F5F7]">
                {isEditing ? 'Edit Verse / Quote' : 'Add New Wisdom Verse'}
              </h3>
              <p className="text-xs text-[#A1A8B3]">
                {categoryType === 'scripture' ? 'Sacred Verse with Sanskrit & Hindi' : 'Modern Hindi Viral Reflection'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A1A8B3] hover:text-[#F5F5F7] hover:bg-[#2A2E37] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns (Form on left, Live Mobile Preview on right) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Form Controls (7 cols) */}
          <form onSubmit={handleSubmit} className="md:col-span-7 space-y-4">
            {/* Category Toggle Tabs */}
            <div className="p-1 bg-[#121418] border border-[#2A2E37] rounded-xl flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setCategoryType('scripture');
                  if (source === 'Modern Reflections') setSource('Bhagavad Gita');
                  if (!author) setAuthor('भगवान श्रीकृष्ण');
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  categoryType === 'scripture'
                    ? 'bg-[#E6C794] text-[#0D0F12] font-semibold'
                    : 'text-[#A1A8B3] hover:text-[#F5F5F7]'
                }`}
              >
                Sacred Scripture (Gita / Chalisa / Ramayana)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategoryType('viral_wisdom');
                  setSource('Modern Reflections');
                  setAuthor('आधुनिक चिंतन');
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  categoryType === 'viral_wisdom'
                    ? 'bg-[#E6C794] text-[#0D0F12] font-semibold'
                    : 'text-[#A1A8B3] hover:text-[#F5F5F7]'
                }`}
              >
                Modern / Viral Wisdom
              </button>
            </div>

            {/* Source & Reference Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-medium text-[#A1A8B3] mb-1">
                  Source Collection
                </label>
                {categoryType === 'scripture' ? (
                  <select
                    value={source}
                    onChange={(e) => {
                      setSource(e.target.value);
                      if (e.target.value === 'Bhagavad Gita') setAuthor('भगवान श्रीकृष्ण');
                      else if (e.target.value === 'Hanuman Chalisa') setAuthor('गोस्वामी तुलसीदास');
                      else if (e.target.value === 'Ramcharitmanas') setAuthor('गोस्वामी तुलसीदास');
                    }}
                    className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
                  >
                    <option value="Bhagavad Gita">Bhagavad Gita</option>
                    <option value="Hanuman Chalisa">Hanuman Chalisa</option>
                    <option value="Ramcharitmanas">Ramcharitmanas</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Modern Reflections"
                    className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
                  />
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-medium text-[#A1A8B3] mb-1">
                  Chapter / Verse / Topic
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder={categoryType === 'scripture' ? 'e.g. अध्याय 2, श्लोक 47' : 'e.g. Inner Strength'}
                  className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
                />
              </div>
            </div>

            {/* Author Attribution */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-medium text-[#A1A8B3] mb-1">
                Attribution / Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. भगवान श्रीकृष्ण"
                className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
              />
            </div>

            {/* Sanskrit / Awadhi Verse (if Scripture) */}
            {categoryType === 'scripture' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-medium text-[#A1A8B3] mb-1">
                  Sanskrit / Awadhi Verse (मूल श्लोक / चौपाई)
                </label>
                <textarea
                  rows={2}
                  value={sanskrit}
                  onChange={(e) => setSanskrit(e.target.value)}
                  placeholder="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन..."
                  className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-sm font-serif text-[#E6C794] focus:outline-none focus:border-[#E6C794] leading-relaxed resize-none"
                />
              </div>
            )}

            {/* Hindi Meaning (Required) */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-medium text-[#A1A8B3] mb-1">
                Hindi Meaning & Translation (सरल एवं आधुनिक हिंदी) <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={hindiMeaning}
                onChange={(e) => setHindiMeaning(e.target.value)}
                placeholder="कर्म करने में ही तुम्हारा अधिकार है, उसके फलों में कभी नहीं..."
                className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-sm font-hindi text-[#F5F5F7] focus:outline-none focus:border-[#E6C794] leading-relaxed resize-none"
              />
            </div>

            {/* Target Moods Multi-Select */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-medium text-[#A1A8B3] mb-1.5">
                Target Emotional States (Maps to user selection)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_CATEGORIES.map((m) => {
                  const isSelected = moodTags.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMoodTag(m.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#E6C794] text-[#0D0F12] font-semibold'
                          : 'bg-[#121418] border border-[#2A2E37] text-[#A1A8B3] hover:text-[#F5F5F7]'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Viral Spotlight Toggle */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-[#121418] border border-[#2A2E37]">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-medium text-[#F5F5F7]">Spotlight / Viral Story Candidate</span>
                  <p className="text-[10px] text-[#A1A8B3]">Featured prominently in mobile story creator</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isViral}
                onChange={(e) => setIsViral(e.target.checked)}
                className="w-4 h-4 accent-[#E6C794] rounded cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#2A2E37]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#A1A8B3] hover:text-[#F5F5F7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-[#E6C794] text-[#0D0F12] hover:bg-[#D4B27B] transition-all shadow-md"
              >
                {isEditing ? 'Save Changes' : 'Add to Collection'}
              </button>
            </div>
          </form>

          {/* Right: Real-time Live Preview Card (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#121418] border border-[#2A2E37] p-6 rounded-2xl">
            <span className="text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-3">
              Live Card Preview
            </span>

            <div className="w-full max-w-xs p-5 rounded-2xl bg-gradient-to-b from-[#1C2028] to-[#14161C] border border-[#E6C794]/30 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-[10px] text-[#E6C794] font-medium border-b border-[#2A2E37] pb-2">
                <span className="uppercase tracking-widest">{source}</span>
                <span>{section || 'Verse'}</span>
              </div>

              {sanskrit && (
                <p className="text-[13px] font-serif leading-relaxed text-center text-[#E6C794] whitespace-pre-line">
                  "{sanskrit}"
                </p>
              )}

              <p className="text-[13px] font-hindi leading-relaxed text-center text-[#F5F5F7]">
                {hindiMeaning || 'हिंदी अनुवाद यहाँ दिखाई देगा...'}
              </p>

              <div className="pt-2 text-center border-t border-[#2A2E37]/60">
                <span className="text-[10px] text-[#6B7280]">{author}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#6B7280] text-center mt-3">
              This card format is used in the mobile lockscreen widget and story studio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
