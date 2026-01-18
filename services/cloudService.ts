
import { GoogleGenAI } from "@google/genai";
import { Activity } from '../types';
import { CLOUD_BACKUP_KEY } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const cloudService = {
  backupToCloud: async (activities: Activity[]): Promise<boolean> => {
    // Simulate cloud delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Actually store in a separate local key to simulate a remote DB
    localStorage.setItem(CLOUD_BACKUP_KEY, JSON.stringify(activities));

    try {
        // Optional: Use Gemini to "verify" or "summarize" backup integrity
        await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `The user has backed up ${activities.length} sports activities. Acknowledge this with a brief confirmation message.`
        });
    } catch (e) {
        console.warn("Gemini acknowledgement failed, but backup saved locally.", e);
    }
    
    return true;
  },

  restoreFromCloud: async (): Promise<Activity[] | null> => {
    const confirm = window.confirm("Are you sure you want to restore from cloud? This will overwrite all current local data.");
    if (!confirm) return null;

    await new Promise(resolve => setTimeout(resolve, 1200));
    const data = localStorage.getItem(CLOUD_BACKUP_KEY);
    if (!data) {
        alert("No cloud backup found.");
        return null;
    }
    
    return JSON.parse(data);
  }
};
