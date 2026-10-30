import React, { useState } from 'react';
import { 
  Upload, 
  Trash2, 
  Eye, 
  Smartphone
} from 'lucide-react';
import { CURATED_WALLPAPERS } from '../data/curatedWallpapers';

export default function WallpaperManagerView() {
  const [wallpapers, setWallpapers] = useState(CURATED_WALLPAPERS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [previewWallpaper, setPreviewWallpaper] = useState(wallpapers[0]);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('nature');
  const [newUrl, setNewUrl] = useState('');

  const filteredWallpapers = wallpapers.filter(
    (wp) => selectedFilter === 'all' || wp.category === selectedFilter
  );

  const handleAddWallpaper = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('Please provide a title and image URL');
      return;
    }

    const newWp = {
      id: `custom_wp_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      categoryLabel: newCategory.toUpperCase(),
      url: newUrl,
      thumbnail: newUrl,
      accentColor: '#F5F5F7',
      recommendedOpacity: 0.65,
      isPopular: false
    };

    setWallpapers([newWp, ...wallpapers]);
    setIsUploadOpen(false);
    setNewTitle('');
    setNewUrl('');
  };

  const handleDelete = (id) => {
    if (wallpapers.length <= 1) {
      alert('Must retain at least 1 wallpaper.');
      return;
    }
    setWallpapers(wallpapers.filter((w) => w.id !== id));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Controls & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-[#181B20] border border-[#2A2E37] rounded-xl overflow-x-auto">
          {['all', 'nature', 'texture', 'smoke', 'sky'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                selectedFilter === cat
                  ? 'bg-[#E6C794] text-[#0D0F12] font-semibold'
                  : 'text-[#A1A8B3] hover:text-[#F5F5F7]'
              }`}
            >
              {cat === 'all' ? 'All Wallpapers' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E6C794] text-[#0D0F12] text-xs font-semibold rounded-xl hover:bg-[#D4B27B] transition-all shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Ultra HD Wallpaper</span>
        </button>
      </div>

      {/* Main Wallpaper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredWallpapers.map((wp) => (
          <div
            key={wp.id}
            className="group relative rounded-2xl bg-[#181B20] border border-[#2A2E37] overflow-hidden hover:border-[#E6C794]/60 transition-all shadow-md flex flex-col"
          >
            {/* Image Preview Container (9:16 Aspect Ratio) */}
            <div className="relative aspect-[9/14] w-full overflow-hidden bg-black">
              <img
                src={wp.thumbnail || wp.url}
                alt={wp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Category Pill */}
              <span className="absolute top-3 left-3 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[#E6C794] border border-white/10">
                {wp.categoryLabel || wp.category}
              </span>

              {/* Action Overlays */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                <button
                  onClick={() => setPreviewWallpaper(wp)}
                  className="p-2.5 rounded-full bg-white/20 text-white hover:bg-[#E6C794] hover:text-[#0D0F12] transition-colors"
                  title="Test in Simulator"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(wp.id)}
                  className="p-2.5 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Wallpaper"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[#F5F5F7] truncate">{wp.title}</h4>
                <p className="text-[10px] text-[#A1A8B3]">4K Ultra HD &bull; WebP</p>
              </div>
              {wp.isPopular && (
                <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  Popular
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simulator Modal (when Eye is clicked) */}
      {previewWallpaper && (
        <div className="p-6 rounded-2xl bg-[#181B20] border border-[#2A2E37] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#E6C794] text-xs font-semibold uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Active Simulator Texture</span>
            </div>
            <h3 className="text-lg font-bold text-[#F5F5F7]">{previewWallpaper.title}</h3>
            <p className="text-xs text-[#A1A8B3] max-w-xl">
              This wallpaper texture is currently applied to the live lock screen simulator on the dashboard.
              You can verify font readability and contrast before publishing to users.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-24 rounded-xl overflow-hidden border border-[#E6C794]/40 shadow-lg">
              <img src={previewWallpaper.url} alt="mini" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => alert(`Wallpaper "${previewWallpaper.title}" set as primary lockscreen texture.`)}
              className="px-4 py-2 bg-[#1F242C] border border-[#E6C794]/40 text-[#E6C794] text-xs font-semibold rounded-xl hover:bg-[#E6C794] hover:text-[#0D0F12] transition-colors"
            >
              Set as Default Texture
            </button>
          </div>
        </div>
      )}

      {/* Add New Wallpaper Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181B20] border border-[#2A2E37] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-[#F5F5F7]">Add Ultra HD Wallpaper</h3>
            <p className="text-xs text-[#A1A8B3]">
              Provide a high-resolution 9:16 vertical image URL (Unsplash or Firebase Cloud Storage).
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
                  placeholder="e.g. Celestial Dawn"
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
                  Image URL (Ultra HD)
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#2A2E37]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#A1A8B3] hover:text-[#F5F5F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#E6C794] text-[#0D0F12] hover:bg-[#D4B27B]"
                >
                  Add Wallpaper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
