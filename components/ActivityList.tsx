
import React, { useState, useMemo } from 'react';
import { Activity, ActivityType, ActivityTypeCodes, ActivityFilters } from '../types';
import { ACTIVITY_TYPES } from '../constants';
import { formatDuration, getCurrentYear } from '../utils/formatters';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit }) => {
  const currentYear = getCurrentYear();
  const [filters, setFilters] = useState<ActivityFilters>({
    type: 'All',
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-12-31`
  });

  const filteredActivities = useMemo(() => {
    return activities
      .filter(a => {
        const matchesType = filters.type === 'All' || a.type === filters.type;
        const matchesDate = a.date >= filters.startDate && a.date <= filters.endDate;
        return matchesType && matchesDate;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [activities, filters]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    ACTIVITY_TYPES.forEach(t => counts[t] = 0);
    filteredActivities.forEach(a => counts[a.type]++);
    return counts;
  }, [filteredActivities]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Filters</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Activity Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none"
            >
              <option value="All">All Activities</option>
              {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">From</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">To</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* List Items */}
      <div className="space-y-2">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-medium">No activities found for this period.</div>
        ) : (
          filteredActivities.map(a => (
            <button
              key={a.id}
              onClick={() => onEdit(a)}
              className="w-full flex items-center bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-300 active:scale-[0.98] transition-all gap-4 text-left shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                {ActivityTypeCodes[a.type]}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-slate-800 text-sm">{a.type}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{a.date}</span>
                </div>
                <div className="flex gap-3 text-xs text-slate-500 font-medium">
                  <span>{formatDuration(a.duration)}</span>
                  <span>•</span>
                  <span>{a.distance?.toFixed(1) || '0.0'} km</span>
                </div>
                {a.comments && (
                  <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[150px]">
                    {a.comments.slice(0, 10)}{a.comments.length > 10 ? '...' : ''}
                  </p>
                )}
              </div>
              <div className="text-slate-300">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Stats Summary Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {ACTIVITY_TYPES.map(t => (
                <div key={t} className="flex flex-col items-center bg-slate-50 rounded-lg py-1 border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight">{ActivityTypeCodes[t]}</span>
                    <span className="text-xs font-bold text-blue-600">{stats[t]}</span>
                </div>
            ))}
            <div className="flex flex-col items-center bg-blue-600 rounded-lg py-1 col-span-1 shadow-sm">
                <span className="text-[9px] font-bold text-blue-100 uppercase leading-tight">Total</span>
                <span className="text-xs font-bold text-white">{filteredActivities.length}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
