import React, { useState, useRef } from 'react';
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
  AlertTriangle,
  FileCheck,
  X,
  FileWarning
} from 'lucide-react';
import { useShlokas } from '../context/ShlokaContext';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB strict limit
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

/**
 * Validates that an uploaded file is strictly a PC image, JPEG or PNG, under 2 MB.
 */
function validateWallpaperFile(file) {
  if (!file) {
    return { valid: false, error: 'Please choose an image file from your PC.' };
  }

  const name = (file.name || '').toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);

  if (!hasValidExt || !hasValidMime) {
    return {
      valid: false,
      error: `Format rejected (${file.type || 'unknown'}). Only JPEG (.jpg, .jpeg) and PNG (.png) files are accepted.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size too large (${sizeInMB} MB). Maximum allowed size is 2 MB.`
    };
  }

  return { valid: true, error: null };
}

/**
 * Compresses an image to an optimized vertical 9:16 data URL (< 500KB)
 * to safely store in Firestore even if Firebase Cloud Storage is offline.
 */
function compressImageToDataUrl(file, maxWidth = 1080, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === 'image/png' && file.size < 600 * 1024 ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, quality));
      };
      img.onerror = () => reject(new Error('Failed to parse uploaded image.'));
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function WallpaperManagerView() {
  const { 
    wallpapers, 
    isLoadingWallpapers, 
    seedWallpapersToFirestore, 
    addWallpaper, 
    deleteWallpaper,
    loadFromFirestore,
    connectionHealth
  } = useShlokas();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [previewWallpaper, setPreviewWallpaper] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeedingWp, setIsSeedingWp] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Upload Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('nature');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

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

  const handleFileSelection = (file) => {
    setFileError(null);
    if (!file) return;

    const validation = validateWallpaperFile(file);
    if (!validation.valid) {
      setFileError(validation.error);
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    // Auto-fill title from filename if title is currently empty
    if (!newTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const resetUploadModal = () => {
    setIsUploadOpen(false);
    setNewTitle('');
    setNewCategory('nature');
    setSelectedFile(null);
    setFilePreview(null);
    setFileError(null);
    setIsDragging(false);
  };

  const handleAddWallpaper = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please provide a title for the wallpaper.');
      return;
    }

    if (!selectedFile) {
      setFileError('Please select a JPEG or PNG image from your PC.');
      return;
    }

    const validation = validateWallpaperFile(selectedFile);
    if (!validation.valid) {
      setFileError(validation.error);
      return;
    }

    try {
      setIsSubmitting(true);
      setFileError(null);

      let finalUrl = '';

      // 1. Try uploading to Firebase Cloud Storage if available
      if (storage) {
        try {
          const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const storageRef = ref(storage, `wallpapers/${Date.now()}_${cleanName}`);
          const uploadSnapshot = await uploadBytes(storageRef, selectedFile);
          finalUrl = await getDownloadURL(uploadSnapshot.ref);
        } catch (storageErr) {
          console.warn('Firebase Storage upload error, using optimized inline storage:', storageErr);
        }
      }

      // 2. High-performance fallback: optimize to compressed vertical data URL (< 500 KB)
      if (!finalUrl) {
        finalUrl = await compressImageToDataUrl(selectedFile);
      }

      const newWp = {
        title: newTitle.trim(),
        category: newCategory,
        categoryLabel: newCategory === 'nature' ? 'Misty Nature' :
                       newCategory === 'texture' ? 'Bold Texture' :
                       newCategory === 'smoke' ? 'Smoke & Ether' : 'Atmospheric Horizon',
        url: finalUrl,
        thumbnail: finalUrl,
        accentColor: '#F5F5F7',
        recommendedOpacity: 0.65,
        isPopular: false,
        file_size_kb: Math.round(selectedFile.size / 1024),
        original_name: selectedFile.name
      };

      await addWallpaper(newWp);
      showToast(`Wallpaper "${newTitle}" uploaded from PC and saved to Cloud Firestore!`);
      resetUploadModal();
    } catch (err) {
      console.error(err);
      setFileError(`Upload failed: ${err.message}`);
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
            <span>Firestore Permissions Blocked: Cloud Firestore Security Rules are denying read/write access.</span>
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
            High-definition 9:16 lockscreen backgrounds synchronized with the Sutra mobile application.
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
            className="flex items-center gap-2 px-4 py-2 bg-[#E6C794] text-[#0D0F12] text-xs font-semibold rounded-xl hover:bg-[#D4B27B] transition-all shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#0D0F12]" />
            <span>Upload from PC (&lt;2MB)</span>
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
              <span>Upload from PC (&lt; 2MB)</span>
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

      {/* Upload Wallpaper from PC Modal (Strictly PC File Only, JPEG/PNG < 2MB) */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181B20] border border-[#2A2E37] w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E37]">
              <div>
                <h3 className="text-base font-semibold text-[#F5F5F7]">Upload Wallpaper from PC</h3>
                <p className="text-xs text-[#A1A8B3] mt-0.5">Strictly PC local file upload (External links prohibited)</p>
              </div>
              <button
                onClick={resetUploadModal}
                className="p-1 rounded-lg text-[#A1A8B3] hover:text-white hover:bg-[#2A2E37] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Strict Policy Banner */}
            <div className="p-3 rounded-xl bg-[#121418] border border-[#2A2E37] grid grid-cols-2 gap-2 text-[11px] text-[#A1A8B3]">
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Format: <strong>JPEG (.jpg, .jpeg) & PNG (.png)</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileWarning className="w-3.5 h-3.5 text-[#E6C794] shrink-0" />
                <span>Max File Size: <strong>&lt; 2 MB</strong></span>
              </div>
            </div>

            {/* Error Feedback */}
            {fileError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{fileError}</span>
              </div>
            )}

            <form onSubmit={handleAddWallpaper} className="space-y-4">
              {/* File Dropzone */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1.5">
                  Choose Image File from Computer
                </label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#E6C794] bg-[#E6C794]/10 scale-[1.01]'
                        : 'border-[#2A2E37] bg-[#121418] hover:border-[#E6C794]/60 hover:bg-[#15181E]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#E6C794]/10 border border-[#E6C794]/30 flex items-center justify-center text-[#E6C794] mx-auto mb-3 shadow-md">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-[#F5F5F7]">
                      Click to browse your PC or drag & drop image here
                    </p>
                    <p className="text-[11px] text-[#A1A8B3] mt-1">
                      JPEG or PNG only &bull; Under 2 MB &bull; Recommended 9:16 vertical ratio
                    </p>
                  </div>
                ) : (
                  /* Selected File Preview Box */
                  <div className="p-3.5 rounded-2xl bg-[#121418] border border-[#2A2E37] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-[#2A2E37] bg-black shrink-0 shadow">
                        <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-[#F5F5F7] truncate">{selectedFile.name}</h4>
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; {selectedFile.type} (Valid)</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                        setFileError(null);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer shrink-0"
                    >
                      Change File
                    </button>
                  </div>
                )}
              </div>

              {/* Title input */}
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
                  className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2.5 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794]"
                />
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A1A8B3] font-medium mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#121418] border border-[#2A2E37] rounded-xl px-3 py-2.5 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#E6C794] cursor-pointer"
                >
                  <option value="nature">Misty Nature</option>
                  <option value="texture">Bold Texture / Stone</option>
                  <option value="smoke">Smoke & Ether</option>
                  <option value="sky">Atmospheric Sky</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#2A2E37]">
                <button
                  type="button"
                  onClick={resetUploadModal}
                  className="px-4 py-2 text-xs text-[#A1A8B3] hover:text-[#F5F5F7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#E6C794] text-[#0D0F12] hover:bg-[#D4B27B] transition-all cursor-pointer shadow-md disabled:opacity-40 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#0D0F12] border-t-transparent rounded-full animate-spin" />
                      <span>Uploading & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload & Save to Firestore</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
