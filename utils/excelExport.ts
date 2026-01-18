
import { Activity } from '../types';
import { formatDuration } from './formatters';

export const downloadAsExcel = (activities: Activity[]) => {
  // We use CSV with UTF-8 BOM to ensure Excel opens it correctly with columns
  const headers = ['Date (YYYY/MM/DD)', 'Activity Type', 'Duration', 'Distance (km)', 'Comments'];
  
  const rows = activities.sort((a, b) => b.date.localeCompare(a.date)).map(a => [
    a.date.replace(/-/g, '/'),
    a.type,
    formatDuration(a.duration),
    a.distance?.toFixed(1) || '0.0',
    a.comments || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Excel needs a BOM for UTF-8 CSVs
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ProSport_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
