
import { Activity } from '../types';
import { STORAGE_KEY } from '../constants';

export const storageService = {
  saveActivities: (activities: Activity[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  },

  loadActivities: (): Activity[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse activities', e);
      return [];
    }
  }
};
