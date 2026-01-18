
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import { Activity, Page } from './types';
import { storage, exportToExcel } from './utils';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Initialize from storage
  useEffect(() => {
    const saved = storage.loadActivities();
    setActivities(saved);
  }, []);

  // Save on change
  useEffect(() => {
    if (activities.length > 0 || localStorage.getItem('sports_activities')) {
       storage.saveActivities(activities);
    }
  }, [activities]);

  const handleAddActivity = (data: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...data,
      id: crypto.randomUUID()
    };
    setActivities(prev => [...prev, newActivity]);
    setCurrentPage('list');
  };

  const handleUpdateActivity = (data: Omit<Activity, 'id'>) => {
    if (!editingActivity) return;
    const updated = activities.map(a => 
      a.id === editingActivity.id ? { ...data, id: editingActivity.id } : a
    );
    setActivities(updated);
    setEditingActivity(null);
    setCurrentPage('list');
  };

  const startEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setCurrentPage('add');
  };

  const cancelEdit = () => {
    setEditingActivity(null);
    setCurrentPage('list');
  };

  const handleDownload = () => {
    if (activities.length === 0) {
      alert("No activities to export!");
      return;
    }
    exportToExcel(activities);
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage} 
      onDownload={handleDownload}
    >
      {currentPage === 'add' ? (
        <ActivityForm 
          initialData={editingActivity || undefined}
          onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity}
          onCancel={editingActivity ? cancelEdit : undefined}
        />
      ) : (
        <ActivityList 
          activities={activities} 
          onEdit={startEdit} 
        />
      )}
    </Layout>
  );
};

export default App;
