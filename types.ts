
export enum ActivityType {
  Run = 'Run',
  Cycling = 'Cycling',
  Bodypump = 'Bodypump',
  Hyrox = 'Hyrox',
  Swim = 'Swim',
  Other = 'Other'
}

export const ActivityTypeShort: Record<ActivityType, string> = {
  [ActivityType.Run]: 'R',
  [ActivityType.Cycling]: 'C',
  [ActivityType.Bodypump]: 'B',
  [ActivityType.Hyrox]: 'H',
  [ActivityType.Swim]: 'S',
  [ActivityType.Other]: 'O',
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

export type Page = 'add' | 'list';
