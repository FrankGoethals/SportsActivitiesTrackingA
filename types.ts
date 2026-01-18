
export enum ActivityType {
  RUN = 'Run',
  CYCLING = 'Cycling',
  BODYPUMP = 'Bodypump',
  HYROX = 'Hyrox',
  SWIM = 'Swim',
  OTHER = 'Other'
}

export const ActivityTypeCodes: Record<ActivityType, string> = {
  [ActivityType.RUN]: 'R',
  [ActivityType.CYCLING]: 'C',
  [ActivityType.BODYPUMP]: 'B',
  [ActivityType.HYROX]: 'H',
  [ActivityType.SWIM]: 'S',
  [ActivityType.OTHER]: 'O'
};

export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Activity {
  id: string;
  date: string; // YYYY-MM-DD
  type: ActivityType;
  duration: Duration;
  distance?: number; // km
  comments?: string;
}

export interface ActivityFilters {
  type: ActivityType | 'All';
  startDate: string;
  endDate: string;
}
