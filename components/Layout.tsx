
import React from 'react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onDownload: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange, onDownload }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f7]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex bg-gray-100 p-1 rounded-xl flex-1 mr-2">
            <button
              onClick={() => onPageChange('add')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                currentPage === 'add' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
              }`}
            >
              Add New
            </button>
            <button
              onClick={() => onPageChange('list')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                currentPage === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
              }`}
            >
              Overview
            </button>
          </div>
          <button
            onClick={onDownload}
            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 active:scale-95 transition-all"
            title="Download Excel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Footer Spacer for Mobile */}
      <div className="safe-area-bottom h-4" />
    </div>
  );
};

export default Layout;
