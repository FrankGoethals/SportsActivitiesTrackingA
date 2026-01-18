
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'add' | 'list';
  onTabChange: (tab: 'add' | 'list') => void;
  onDownload: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onDownload }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <nav className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <button
            onClick={() => onTabChange('add')}
            className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'add' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 active:bg-slate-200'
            }`}
          >
            Add New
          </button>
          <button
            onClick={() => onTabChange('list')}
            className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'list' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 active:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={onDownload}
            className="flex-1 h-10 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-md active:bg-emerald-700 transition-colors"
          >
            Download
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-xl mx-auto p-4 pb-24">
        {children}
      </main>
    </div>
  );
};

export default Layout;
