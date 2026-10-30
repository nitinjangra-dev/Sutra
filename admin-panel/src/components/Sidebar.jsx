import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Image as ImageIcon, 
  Settings, 
  Feather, 
  LogOut, 
  ShieldCheck,
  Database
} from 'lucide-react';
import { isFirebaseConfigured } from '../firebase/config';
import { useShlokas } from '../context/ShlokaContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentView, setCurrentView, openAddModal }) {
  const { publishedVersion, shlokas, isLoadingFirestore, connectionHealth } = useShlokas();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shlokas', label: 'All Shlokas & Verses', icon: BookOpen },
    { id: 'wallpapers', label: 'Curated Wallpapers', icon: ImageIcon },
    { id: 'settings', label: 'Firebase & Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#121418] border-r border-[#2A2E37] flex flex-col justify-between shrink-0 select-none">
      {/* Brand & Header */}
      <div>
        <div className="p-6 border-b border-[#2A2E37]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1E232B] border border-[#E6C794]/40 flex items-center justify-center text-[#E6C794] shadow-sm">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-wider text-[#F5F5F7]">SUTRA</h1>
              <p className="text-[11px] uppercase tracking-widest text-[#E6C794] font-medium">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E6C794] text-[#0D0F12] font-semibold shadow-md'
                    : 'text-[#A1A8B3] hover:text-[#F5F5F7] hover:bg-[#181B20]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0D0F12]' : 'text-[#A1A8B3]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4">
            <button
              onClick={openAddModal}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-[#1F242C] border border-[#E6C794]/30 text-[#E6C794] hover:bg-[#E6C794] hover:text-[#0D0F12] transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Quote</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Footer Info & Connection Status */}
      <div className="p-4 border-t border-[#2A2E37]/60 space-y-3">
        {/* Sync Status Badge */}
        <div className="px-3 py-2 rounded-lg bg-[#181B20] border border-[#2A2E37] flex items-center justify-between text-xs">
          <span className="text-[#A1A8B3]">Live Version</span>
          <span className="font-mono text-[#E6C794] font-semibold">v{publishedVersion}</span>
        </div>

        {/* Firebase Live Database Status */}
        <div className="px-3 py-2 rounded-lg bg-[#181B20] border border-[#2A2E37] flex items-center justify-between text-xs">
          <span className="text-[#A1A8B3] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#E6C794]" />
            <span>Firestore</span>
          </span>
          {isLoadingFirestore ? (
            <span className="text-[#A1A8B3] text-[11px]">Syncing...</span>
          ) : connectionHealth === 'permission_denied' ? (
            <span className="text-rose-400 font-medium text-[11px]">Blocked (Rules)</span>
          ) : connectionHealth === 'offline' ? (
            <span className="text-rose-400 font-medium text-[11px]">Offline</span>
          ) : isFirebaseConfigured ? (
            shlokas.length === 0 ? (
              <span className="text-amber-400 font-medium text-[11px]">0 (Empty)</span>
            ) : (
              <span className="text-emerald-400 font-medium text-[11px]">{shlokas.length} Verses</span>
            )
          ) : (
            <span className="text-amber-400 text-[11px]">Sandbox</span>
          )}
        </div>

        {/* Owner Identity & Logout */}
        <div className="p-2.5 rounded-xl bg-[#181B20] border border-[#2A2E37] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#E6C794] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Owner</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out of Console"
              className="text-[#8E95A5] hover:text-rose-400 p-1 rounded-md hover:bg-[#262B36] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[11px] font-mono text-[#A1A8B3] truncate" title={user?.email || 'Administrator'}>
            {user?.email || 'Administrator'}
          </div>
        </div>

        <p className="text-[11px] text-center text-[#6B7280]">
          Sutra Mobile &bull; Engine v1.0
        </p>
      </div>
    </aside>
  );
}
