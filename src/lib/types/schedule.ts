import type { DayKey } from '../constants/languages';

// Schedule Types
export type Day = DayKey;

export interface ClassItem {
  name: string;
  time: string;
  type?: 'lecture' | 'lab' | 'studio';
  location?: string;
  instructor?: string;
  notes?: string;
}

export interface ClassType {
  type: 'lecture' | 'lab' | 'studio';
  pattern: string;
}

export type ClassTypes = {
  [K in 'lecture' | 'lab' | 'studio']: ClassType;
};

export interface ScheduleData {
  [key: string]: ClassItem[];
}

export interface DayViewProps {
  schedule: ClassItem[];
  day: Day;
  darkMode: boolean;
  courseColors: Record<string, string>;
  onClassClick: (item: ClassItem, day: string) => void;
  onAddClick: (time: string) => void;
  onDeleteClass: (classItem: ClassItem) => void;
}

export interface WeekViewProps {
  schedule: ScheduleData;
  days: readonly Day[];
  darkMode: boolean;
  courseColors: Record<string, string>;
  onClassClick: (item: ClassItem, day: string) => void;
  onAddClick: (day: string, time: string) => void;
  onDeleteClass: (day: string, classItem: ClassItem) => void;
  onColorChange?: (className: string, color: string) => void;
}

export interface AnalyticsProps {
  schedule: ScheduleData;
  days: readonly Day[];
  darkMode: boolean;
}

export interface HeaderProps {
  onAddClick: () => void;
  onExportClick: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  view: 'day' | 'week';
  onViewChange: (view: 'day' | 'week') => void;
  selectedDay: Day;
  onDayChange: (day: Day) => void;
  days: readonly Day[];
  schedule: ProcessedSchedule;
  courseColors: Record<string, string>;
}

export interface ScheduleForm {
  day: Day;
  name: string;
  start: string;
  end: string;
  time?: string;
  type?: 'lecture' | 'lab' | 'studio';
  location?: string;
  instructor?: string;
  notes?: string;
}

export interface ScheduleStats {
  totalClasses: number;
  classesPerDay: Array<{ day: string; count: number }>;
  busyDay: { day: string; count: number };
  totalHours: number;
  averagePerDay: string;
  activeDays: number;
} 