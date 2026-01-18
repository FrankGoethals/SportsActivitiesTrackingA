
import { ActivityType, Duration } from './types';

export const DEFAULT_DURATION: Duration = {
  hours: 0,
  minutes: 59,
  seconds: 59
};

export const ACTIVITY_TYPES: ActivityType[] = [
  ActivityType.RUN,
  ActivityType.CYCLING,
  ActivityType.BODYPUMP,
  ActivityType.HYROX,
  ActivityType.SWIM,
  ActivityType.OTHER
];

export const STORAGE_KEY = 'pro_sport_tracker_data';
export const CLOUD_BACKUP_KEY = 'pro_sport_tracker_cloud_sim';
