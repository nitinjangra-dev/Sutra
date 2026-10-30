import React, { useState } from 'react';
import { 
  X, 
  CloudUpload, 
  CheckCircle2, 
  Download, 
  Zap, 
  Sparkles,
  Database
} from 'lucide-react';
import { useShlokas } from '../context/ShlokaContext';
import { isFirebaseConfigured } from '../firebase/config';

export default function PublishModal({ isOpen, onClose }) {
  const { 
    shlokas, 
    publishedVersion, 
    publishAndSync, 
    generatePackedBundles 
  } = useShlokas();

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentNum = parseFloat(publishedVersion) || 1.0;
  const nextVersion = (currentNum + 0.1).toFixed(1);

  const handlePublish = async () => {
    setIsPublishing(true);
    setErrorMsg('');
    try {
      await publishAndSync();
      setPublishSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to publish to Firebase');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadJSON = () => {
    const { bundles, versionsMetadata } = generatePackedBundles(nextVersion);
    const exportData = {
      meta: versionsMetadata,
      bundles: bundles
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sutra_packed_v${nextVersion}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181B20] border border-[#2A2E37] w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2E37]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6C794]/10 border border-[#E6C794]/30 flex items-center justify-center text-[#E6C794]">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#F5F5F7]">Publish & Sync App Content</h3>
              <p className="text-xs text-[#A1A8B3]">Zero-Read bundle packaging & version synchronization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#A1A8B3] hover:text-[#F5F5F7] hover:bg-[#2A2E37] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Packing Architecture Explanation */}
        <div className="p-4 rounded-2xl bg-[#121418] border border-[#2A2E37] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A8B3]">Current Live Version:</span>
            <span className="font-mono text-[#F5F5F7] font-bold">v{publishedVersion}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A8B3]">Target Published Version:</span>
            <span className="font-mono text-[#E6C794] font-bold text-sm">v{nextVersion}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A8B3]">Total Packed Verses:</span>
            <span className="font-mono text-[#F5F5F7] font-semibold">{shlokas.length} lines</span>
          </div>

          <div className="pt-2 border-t border-[#2A2E37]/60 flex items-center gap-2 text-[11px] text-emerald-400">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Packs 100 quotes into 1 single document. Mobile users consume 0 daily reads during usage!</span>
          </div>
        </div>

        {/* Firebase Status Banner */}
        <div className="p-3 rounded-xl bg-[#121418] border border-[#2A2E37] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#A1A8B3]" />
            <span className="text-[#A1A8B3]">Target Backend:</span>
          </div>
          {isFirebaseConfigured ? (
            <span className="text-emerald-400 font-medium">Cloud Firestore Live</span>
          ) : (
            <span className="text-amber-400 font-medium">Local Sandbox / Offline Export</span>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {publishSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-semibold text-sm text-emerald-300">Successfully Published v{nextVersion}!</h4>
            <p className="text-xs text-[#A1A8B3]">
              All client mobile apps will detect the new version on next launch and sync seamlessly.
            </p>
          </div>
        ) : null}

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2A2E37]">
          {/* Download JSON Button */}
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#1F242C] border border-[#2A2E37] text-[#A1A8B3] hover:text-[#F5F5F7] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Packed JSON</span>
          </button>

          <div className="w-full sm:w-auto flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#A1A8B3] hover:text-[#F5F5F7]"
            >
              {publishSuccess ? 'Close' : 'Cancel'}
            </button>

            {!publishSuccess && (
              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublish}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold bg-[#E6C794] text-[#0D0F12] hover:bg-[#D4B27B] disabled:opacity-50 transition-all shadow-md"
              >
                {isPublishing ? (
                  <span>Compiling & Publishing...</span>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    <span>Publish Version {nextVersion}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
