
import React, { useState, useMemo } from 'react';
import { Activity, ActivityType, ActivityTypeShort } from '../types';
import { formatDuration, getCurrentYearRange } from '../utils';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onEdit }) => {
  const { start: defaultStart, end: defaultEnd } = getCurrentYearRange();
  
  const [filterType, setFilterType] = useState<ActivityType | 'All'>('All');
  const [dateStart, setDateStart] = useState(defaultStart);
  const [dateEnd, setDateEnd] = useState(defaultEnd);

  const filteredActivities = useMemo(() => {
    return activities
      .filter(a => {
        const matchesType = filterType === 'All' || a.type === filterType;
        const matchesDate = a.date >= dateStart && a.date <= dateEnd;
        return matchesType && matchesDate;
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // Newest first
  }, [activities, filterType, dateStart, dateEnd]);

  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredActivities.forEach(a => {
      counts[a.type] = (counts[a.type] || 0) + 1;
    });
    return {
      total: filteredActivities.length,
      counts
    };
  }, [filteredActivities]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">From</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full text-sm bg-gray-50 border-none rounded-lg py-2 px-2"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">To</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full text-sm bg-gray-50 border-none rounded-lg py-2 px-2"
            />
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterType('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
              filterType === 'All' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            All
          </button>
          {Object.values(ActivityType).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
                filterType === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-sm">No activities found for this period.</p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div
              key={activity.id}
              onClick={() => onEdit(activity)}
              className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 active:bg-gray-50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                activity.type === ActivityType.Run ? 'bg-orange-100 text-orange-600' :
                activity.type === ActivityType.Cycling ? 'bg-blue-100 text-blue-600' :
                activity.type === ActivityType.Swim ? 'bg-cyan-100 text-cyan-600' :
                activity.type === ActivityType.Bodypump ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {ActivityTypeShort[activity.type]}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-gray-900 truncate">{activity.type}</h3>
                  <span className="text-xs text-gray-400 tabular-nums">{activity.date}</span>
                </div>
                <div className="flex gap-3 text-xs font-medium text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md tabular-nums">{formatDuration(activity.duration)}</span>
                  {activity.distance && (
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md tabular-nums">{activity.distance.toFixed(1)} km</span>
                  )}
                </div>
                {activity.comments && (
                  <p className="mt-1.5 text-xs text-gray-400 truncate italic">
                    {activity.comments.length > 10 ? activity.comments.substring(0, 10) + '...' : activity.comments}
                  </p>
                )}
              </div>
              
              <div className="text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredActivities.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-50">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Summary Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(summary.counts).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-600">{type}</span>
                <span className="text-sm font-bold text-blue-600">{count}</span>
              </div>
            ))}
            <div className="col-span-2 flex justify-between items-center pt-2 mt-2">
              <span className="text-base font-bold text-gray-900">Grand Total</span>
              <span className="text-lg font-black text-blue-600 underline decoration-2 underline-offset-4">{summary.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
