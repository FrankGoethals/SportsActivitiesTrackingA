
import { Activity, Duration } from './types';

export const formatDuration = (d: Duration): string => {
  const h = d.hours.toString();
  const m = d.minutes.toString().padStart(2, '0');
  const s = d.seconds.toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const calculateSpeed = (distance: number | undefined, duration: Duration): string | null => {
  if (!distance || distance <= 0) return null;
  const totalHours = duration.hours + (duration.minutes / 60) + (duration.seconds / 3600);
  if (totalHours <= 0) return null;
  return (distance / totalHours).toFixed(2);
};

export const getTodayStr = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentYearRange = () => {
  const year = new Date().getFullYear();
  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`
  };
};

export const storage = {
  saveActivities: (activities: Activity[]) => {
    localStorage.setItem('sports_activities', JSON.stringify(activities));
  },
  loadActivities: (): Activity[] => {
    const data = localStorage.getItem('sports_activities');
    return data ? JSON.parse(data) : [];
  }
};

export const exportToExcel = (activities: Activity[]) => {
  // @ts-ignore - XLSX is loaded via script tag
  const XLSX = window.XLSX;
  
  const data = activities.map(a => ({
    Date: a.date,
    Type: a.type,
    Duration: formatDuration(a.duration),
    Distance: a.distance || '',
    Comments: a.comments || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
  
  XLSX.writeFile(workbook, `Sports_Activities_${new Date().toISOString().split('T')[0]}.xlsx`);
};
