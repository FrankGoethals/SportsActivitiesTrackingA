
import React, { useState, useEffect } from 'react';
import { Activity, ActivityType, Duration } from '../types';
import { getTodayStr, calculateSpeed } from '../utils';

interface ActivityFormProps {
  initialData?: Activity;
  onSubmit: (activity: Omit<Activity, 'id'>) => void;
  onCancel?: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [date, setDate] = useState(initialData?.date || getTodayStr());
  const [type, setType] = useState<ActivityType>(initialData?.type || ActivityType.Run);
  const [duration, setDuration] = useState<Duration>(initialData?.duration || { hours: 0, minutes: 59, seconds: 59 });
  const [distance, setDistance] = useState<number | undefined>(initialData?.distance);
  const [comments, setComments] = useState(initialData?.comments || '');

  const speed = calculateSpeed(distance, duration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      type,
      duration,
      distance,
      comments
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {initialData ? 'Edit Activity' : 'Log New Activity'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Date *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base"
          />
        </div>

        {/* Activity Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Activity Type *</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(ActivityType).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  type === t
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Duration (H:M:S)</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="H"
              min="0"
              value={duration.hours || ''}
              onChange={(e) => setDuration({ ...duration, hours: parseInt(e.target.value) || 0 })}
              className="w-1/3 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center"
            />
            <span className="text-gray-400 font-bold">:</span>
            <input
              type="number"
              placeholder="M"
              min="0"
              max="59"
              value={duration.minutes || ''}
              onChange={(e) => setDuration({ ...duration, minutes: Math.min(59, parseInt(e.target.value) || 0) })}
              className="w-1/3 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center"
            />
            <span className="text-gray-400 font-bold">:</span>
            <input
              type="number"
              placeholder="S"
              min="0"
              max="59"
              value={duration.seconds || ''}
              onChange={(e) => setDuration({ ...duration, seconds: Math.min(59, parseInt(e.target.value) || 0) })}
              className="w-1/3 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center"
            />
          </div>
        </div>

        {/* Distance */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Distance (KM)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              value={distance || ''}
              onChange={(e) => setDistance(parseFloat(e.target.value) || undefined)}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="Enter km..."
            />
            {speed && (
              <div className="mt-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg inline-block">
                Avg. Speed: {speed} km/h
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Comments</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base resize-none"
            placeholder="How did it feel?"
          />
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col gap-3">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
          >
            {initialData ? 'Update Activity' : 'Save Activity'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-2xl font-semibold text-base active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
