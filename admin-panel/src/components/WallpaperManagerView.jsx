import React, { useState } from 'react';
import { 
  Upload, 
  Trash2, 
  Eye, 
  Smartphone,
  Database,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';
import { useShlokas } from '../context/ShlokaContext';

export default function WallpaperManagerView() {
  const { 
    wallpapers, 
    isLoadingWallpapers, 
    seedWallpapersToFirestore, 
    addWallpaper, 
    deleteWallpaper,
    loadFromFirestore,
    firestoreError,
    connectionHealth
  } = useShlokas();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [previewWallpaper, setPreviewWallpaper] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeedingWp, setIsSeedingWp] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('nature');
  const [newUrl, setNewUrl] = useState('');

  const activePreview = previewWallpaper || (wallpapers.length > 0 ? wallpapers[0] : null);

  const filteredWallpapers = wallpapers.filter(
    (wp) => selectedFilter === 'all' || wp.category === selectedFilter
  );

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  const handleSeedCuratedWallpapers = async () => {
    try {
      setIsSeedingWp(true);
      const count = await seedWallpapersToFirestore();
      showToast(`Successfully saved ${count} Curated Wallpapers to Cloud Firestore!`);
    } catch (err) {
      alert(`Failed to seed wallpapers: ${err.message}`);
    } finally {
      setIsSeedingWp(false);
    }
  };

  const handleAddWallpaper = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('Please provide a title and image URL');
      return;
    }

    try {
      setIsSubmitting(true);
      const newWp = {
        title: newTitle.trim(),
        category: newCategory,
        categoryLabel: newCategory === 'nature' ? 'Misty Nature' :
                       newCategory === 'texture' ? 'Bold Texture' :
                       newCategory === 'smoke' ? 'Smoke & Ether' : 'Atmospheric Horizon',
        url: newUrl.trim(),
        thumbnail: newUrl.trim(),
        accentColor: '#F5F5F7',
        recommendedOpacity: 0.65,
        isPopular: false
      };

      await addWallpaper(newWp);
      showToast(`Wallpaper "${newTitle}" saved directly to Cloud Firestore!`);
      setIsUploadOpen(false);
      setNewTitle('');
      setNewUrl('');
    } catch (err) {
      alert(`Error saving wallpaper: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" from Cloud Firestore?`)) return;
    try {
      await deleteWallpaper(id);
      showToast(`Deleted "${title}" from Cloud Firestore.`);
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Permission / Connection Warning */}
      {connectionHealth === 'permission_denied' && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Firestore Permissions Blocked: Firestore Security Rules are currently denying read/write access.</span>
          </div>
          <button
            onClick={loadFromFirestore}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Header Bar & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2A2E37]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[#F5F5F7]">Cloud Wallpaper Repository</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${
              wallpapers.length > 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              <Database className="w-3 h-3" />
              <span>{wallpapers.length} in Cloud Firestore</span>
            </span>
          </div>
          <p className="text-xs text-[#A1A8B3]">
            Ultra HD lockscreen backgrounds synchronized with the Sutra mobile application.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadFromFirestore}
            disabled={isLoadingWallpapers}
            title="Refresh from Firestore"
            className="p-2.5 rounded-xl bg-[#181B20] border border-[#2A2E37] text-[#A1A8B3] hover:text-[#F5F5F7] hover:border-[#E6C794] transition-all cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingWallpapers ? 'animate-spin text-[#E6C794]' : ''}`} />
          </button>

          {wallpapers.length === 0 && (
            <button
              onClick={handleSeedCuratedWallpapers}
              disabled={isSeedingWp}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E6C794] to-[#C9A96E] text-[#0D0F12] text-xs font-semibold rounded-xl hover:brightness-110 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSeedingWp ? 'Saving to Firestore...' : 'Seed Curated Wallpapers'}</span>
            </button>
          )}

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#181B20] border border-[#2A2E37] hover:border-[#E6C794] text-[#F5F5F7] text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#E6C794]" />
            <span>Upload New Wallpaper</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoadingWallpapers ? (
        <div className="p-16 rounded-3xl bg-[#181B20] border border-[#2A2E37] text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#E6C794] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#A1A8B3]">Querying live wallpapers from Cloud Firestore collection...</p>
        </div>
      ) : wallpapers.length === 0 ? (
        /* Empty State (Truthful) */
        <div className="p-12 rounded-3xl bg-[#181B20] border border-dashed border-[#2A2E37] text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#E6C794]/10 border border-[#E6C794]/30 flex items-center justify-center text-[#E6C794] mx-auto shadow-lg">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h4 className="text-base font-semibold text-[#F5F5F7]">No Wallpapers in Cloud Firestore Yet</h4>
            <p className="text-xs text-[#A1A8B3] leading-relaxed">
              Your Firestore database currently has 0 documents in the <code className="text-[#E6C794] font-mono">wallpapers</code> collection. Mobile apps will use their bundled local fallback until you populate your cloud library.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSeedCuratedWallpapers}
              disabled={isSeedingWp}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E6C794] text-[#0D0F12] text-xs font-semibold rounded-xl hover:bg-[#D4B27B] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSeedingWp ? 'Writing to Firestore...' : 'Populate 5 Curated Wallpapers to Firestore'}</span>
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#121418] border border-[#2A2E37] text-xs font-medium text-[#F5F5F7] hover:border-[#E6C794] rounded-xl transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#E6C794]" />
              <span>Upload Custom Wallpaper</span>
            </button>
          </div>
        </div>
      ) : (
        /* Populated Live Wallpapers */
        <div className="space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#181B20] border border-[#2A2E37] rounded-xl w-fit overflow-x-auto">
            {['all', 'nature', 'texture', 'smoke', 'sky'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-[#E6C794] text-[#0D0F12] font-semibold'
                    : 'text-[#A1A8B3] hover:text-[#F5F5F7]'
                }`}
              >
                {cat === 'all' ? `All (${wallpapers.length})` : cat}
              </button>
            ))}
          </div>

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredWallpapers.map((wp) => (
              <div
                key={wp.id}
                className="group relative rounded-2xl bg-[#181B20] border border-[#2A2E37] overflow-hidden hover:border-[#E6C794]/60 transition-all shadow-md flex flex-col"
              >
                {/* 9:14 Aspect Ratio Preview */}
                <div className="relative aspect-[9/14] w-full overflow-hidden bg-black">
                  <img
                    src={wp.thumbnail || wp.url}
                    alt={wp.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[#E6C794] border border-white/10">
                    {wp.categoryLabel || wp.category}
                  </span>

                  {/* Action Overlays */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-xs">
                    <button
                      onClick={() => setPreviewWallpaper(wp)}
                      className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-[#E6C794] hover:text-[#0D0F12] transition-colors cursor-pointer"
                      title="Inspect Simulator Texture"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(wp.id, wp.title)}
                      className="p-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                      title="Delete from Firestore"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-semibold text-xs text-[#F5F5F7] truncate">{wp.title}</h4>
                    <p className="text-[10px] text-[#A1A8B3] flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Firestore: {wp.id}</span>
                    </p>
                  </div>
                  {wp.isPopular && (
                    <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0">
                      Popular
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulator Preview Card */}
      {activePreview && (
        <div className="p-6 rounded-2xl bg-[#181B20] border border-[#2A2E37] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#E6C794] text-xs font-semibold uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Active Simulator Texture</span>
            </div>
            <h3 className="text-lg font-bold text-[#F5F5F7]">{activePreview.title}</h3>
            <p className="text-xs text-[#A1A8B3] max-w-xl">
              This high-resolution texture is stored in Cloud Firestore (<code className="text-[#E6C794]">{activePreview.id}</code>). It is rendered in the Lock Screen simulator to verify text contrast and sacred shloka legibility.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="w-16 h-24 rounded-xl overflow-hidden border border-[#E6C794]/40 shadow-lg">
              <img src={activePreview.thumbnail || activePreview.url} alt="mini" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Upload Wallpaper Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181B20] border border-[#2A2E37] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#F5F5F7]">Upload Wallpaper to Firestore</h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-xs text-[#A1A8B3] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#A1A8B3]">
              The image URL will be stored in your Cloud Firestore <code className="text-[#E6C794]">wallpapers</code> collection and synced to all mobile apps.
            </p>

            <form onSubmit={handleAddWallpaper} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                  Wallpaper Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Celestial Golden Dawn"
                  className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
                >
                  <option value="nature">Misty Nature</option>
                  <option value="texture">Bold Texture / Stone</option>
                  <option value="smoke">Smoke & Ether</option>
                  <option value="sky">Atmospheric Sky</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                  Image URL (Ultra HD 9:16 Vertical)
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#2A2E37]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#A1A8B3] hover:text-[#F5F5F7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E6C794] text-[#0D0F12] hover:bg-[#D4B27B] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Writing to Firestore...' : 'Save to Firestore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
