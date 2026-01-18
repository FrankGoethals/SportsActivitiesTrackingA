
import React, { useState, useEffect } from 'react';
import { Activity, ActivityType, Duration } from '../types';
import { ACTIVITY_TYPES, DEFAULT_DURATION } from '../constants';
import { getCurrentDateString, calculateSpeed } from '../utils/formatters';

interface ActivityFormProps {
  initialData?: Activity;
  onSubmit: (activity: Activity) => void;
  onCancel?: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [date, setDate] = useState(initialData?.date || getCurrentDateString());
  const [type, setType] = useState<ActivityType>(initialData?.type || ActivityType.RUN);
  const [hours, setHours] = useState(initialData?.duration.hours ?? DEFAULT_DURATION.hours);
  const [minutes, setMinutes] = useState(initialData?.duration.minutes ?? DEFAULT_DURATION.minutes);
  const [seconds, setSeconds] = useState(initialData?.duration.seconds ?? DEFAULT_DURATION.seconds);
  const [distance, setDistance] = useState<string>(initialData?.distance?.toString() || '');
  const [comments, setComments] = useState(initialData?.comments || '');

  const speed = calculateSpeed(parseFloat(distance), { hours, minutes, seconds });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activity: Activity = {
      id: initialData?.id || crypto.randomUUID(),
      date,
      type,
      duration: { hours, minutes, seconds },
      distance: distance ? parseFloat(distance) : undefined,
      comments: comments || undefined
    };
    onSubmit(activity);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800">
        {initialData ? 'Edit Activity' : 'Add New Activity'}
      </h2>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date (Required)</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Type (Required)</label>
        <div className="grid grid-cols-3 gap-2">
          {ACTIVITY_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                type === t 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-300 active:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (H:M:S)</label>
        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="Hrs"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="absolute right-2 top-3 text-[10px] text-slate-400">H</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="59"
              placeholder="Min"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="absolute right-2 top-3 text-[10px] text-slate-400">M</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="59"
              placeholder="Sec"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="absolute right-2 top-3 text-[10px] text-slate-400">S</span>
          </div>
        </div>
      </div>

      {/* Distance */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Distance (km)</label>
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        {parseFloat(distance) > 0 && (
          <div className="pb-3 text-sm font-semibold text-slate-500 italic">
            Speed: <span className="text-blue-600">{speed}</span> km/h
          </div>
        )}
      </div>

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Comments</label>
        <textarea
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="How was the workout?"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl active:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-[2] py-4 px-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:bg-blue-700 transition-colors"
        >
          {initialData ? 'Update Activity' : 'Save Activity'}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
