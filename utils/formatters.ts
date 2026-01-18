
import { Duration } from '../types';

export const formatDuration = (d: Duration): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.hours}:${pad(d.minutes)}:${pad(d.seconds)}`;
};

export const calculateSpeed = (distance: number | undefined, duration: Duration): string => {
  if (!distance || distance <= 0) return '0.0';
  const totalHours = duration.hours + duration.minutes / 60 + duration.seconds / 3600;
  if (totalHours === 0) return '0.0';
  return (distance / totalHours).toFixed(1);
};

export const getCurrentDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};
