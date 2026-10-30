import React, { useState } from 'react';
import { ShlokaProvider } from './context/ShlokaContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginGate from './components/LoginGate';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ShlokasTableView from './components/ShlokasTableView';
import WallpaperManagerView from './components/WallpaperManagerView';
import SettingsView from './components/SettingsView';
import AddEditModal from './components/AddEditModal';
import PublishModal from './components/PublishModal';

function MainApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsAddEditOpen(true);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0D0F12] text-[#F5F5F7] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAddModal={handleOpenAdd}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentView={currentView}
          openPublishModal={() => setIsPublishOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-[#0D0F12]">
          {currentView === 'dashboard' && (
            <DashboardView
              setCurrentView={setCurrentView}
              openAddModal={handleOpenAdd}
            />
          )}

          {currentView === 'shlokas' && (
            <ShlokasTableView
              openEditModal={handleOpenEdit}
              openAddModal={handleOpenAdd}
            />
          )}

          {currentView === 'wallpapers' && <WallpaperManagerView />}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <AddEditModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />

      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
      />
    </div>
  );
}

function AppContent() {
  const { user, isOwner, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0D0F12] flex flex-col items-center justify-center select-none">
        <div className="w-10 h-10 border-2 border-[#E6C687] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#E6C687] font-medium">Verifying Owner Authorization...</p>
      </div>
    );
  }

  if (!user || !isOwner) {
    return <LoginGate />;
  }

  return (
    <ShlokaProvider>
      <MainApp />
    </ShlokaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
