
import React, { useState, useEffect, useCallback } from 'react';
import { Activity } from './types';
import { storageService } from './services/storageService';
import { cloudService } from './services/cloudService';
import { downloadAsExcel } from './utils/excelExport';
import Layout from './components/Layout';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isCloudLoading, setIsCloudLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const data = storageService.loadActivities();
    setActivities(data);
  }, []);

  const handleSaveActivity = useCallback((newActivity: Activity) => {
    setActivities(prev => {
      const exists = prev.find(a => a.id === newActivity.id);
      let updated;
      if (exists) {
        updated = prev.map(a => a.id === newActivity.id ? newActivity : a);
      } else {
        updated = [...prev, newActivity];
      }
      storageService.saveActivities(updated);
      return updated;
    });
    setEditingActivity(null);
    setActiveTab('list');
  }, []);

  const handleDownload = () => {
    if (activities.length === 0) {
      alert("No activities to download yet.");
      return;
    }
    downloadAsExcel(activities);
  };

  const handleBackup = async () => {
    setIsCloudLoading(true);
    try {
        await cloudService.backupToCloud(activities);
        alert("Backup successful!");
    } finally {
        setIsCloudLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsCloudLoading(true);
    try {
        const restored = await cloudService.restoreFromCloud();
        if (restored) {
            setActivities(restored);
            storageService.saveActivities(restored);
            alert("Restored successfully!");
            setActiveTab('list');
        }
    } finally {
        setIsCloudLoading(false);
    }
  };

  return (
    <Layout 
      activeTab={editingActivity ? 'list' : activeTab} 
      onTabChange={(tab) => {
        setEditingActivity(null);
        setActiveTab(tab);
      }}
      onDownload={handleDownload}
    >
      {isCloudLoading && (
        <div className="fixed inset-0 bg-white/80 z-[60] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-slate-800">Processing Cloud Action...</p>
        </div>
      )}

      {editingActivity ? (
        <ActivityForm 
          initialData={editingActivity}
          onSubmit={handleSaveActivity}
          onCancel={() => setEditingActivity(null)}
        />
      ) : activeTab === 'add' ? (
        <div className="space-y-6">
            <ActivityForm onSubmit={handleSaveActivity} />
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Cloud Management</h4>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleBackup}
                        className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 active:scale-95 transition-all text-sm"
                    >
                        Backup to Cloud
                    </button>
                    <button 
                        onClick={handleRestore}
                        className="w-full py-3 border-2 border-slate-200 text-slate-500 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all text-sm"
                    >
                        Restore Data from Cloud
                    </button>
                </div>
            </div>
        </div>
      ) : (
        <ActivityList 
          activities={activities} 
          onEdit={(a) => setEditingActivity(a)} 
        />
      )}
    </Layout>
  );
};

export default App;
