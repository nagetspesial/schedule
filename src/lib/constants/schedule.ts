import type { ScheduleData } from '../types/schedule';

export const DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY'
] as const;

export const HOURS = [
  '06:30',
  '07:30',
  '08:30',
  '09:30',
  '10:30',
  '11:30',
  '12:30',
  '13:30',
  '14:30',
  '15:30',
  '16:30',
  '17:30',
  '18:30',
  '19:30'
] as const;

export const CLASS_COLORS = [
  '#F87171', // Red
  '#FB923C', // Orange
  '#F2B134', // Yellow
  '#10B981', // Green
  '#A1CDA8', // Light Green
  '#60A5FA', // Blue
  '#818CF8', // Indigo
  '#A78BFA', // Purple
  '#F472B6', // Pink
] as const;

export const CLASS_TYPES = {
  lecture: {
    type: 'lecture',
    pattern: 'bg-primary/10'
  },
  lab: {
    type: 'lab',
    pattern: 'bg-primary/10'
  },
  studio: {
    type: 'studio',
    pattern: 'bg-primary/10'
  }
} as const;

export const TIME_SLOTS = HOURS.map((hour) => ({
  time: hour,
  label: hour
}));

export const INITIAL_SCHEDULE: ScheduleData = {
  MONDAY: [
    { 
      name: 'INTERIOR DESIGN 2',
      time: '09:30 - 12:30',
      location: 'R.3.1'
    },
    { 
      name: 'BASIC OF DIGITAL INTERIOR',
      time: '12:30 - 15:30',
      location: 'LAB.KOMPUTER'
    },
    { 
      name: 'BASIC OF INTERIOR CONSTRUCTION',
      time: '15:30 - 18:30',
      location: 'R.3.2'
    }
  ],
  TUESDAY: [
    { 
      name: 'INTERIOR DESIGN METHODOLOGY',
      time: '10:30 - 12:30',
      location: 'R.3.3'
    },
    { 
      name: 'NON-SEATING FURNITURE DESIGN',
      time: '13:30 - 17:30',
      location: 'STUDIO'
    }
  ],
  WEDNESDAY: [
    { 
      name: 'INTERIOR DESIGN 2',
      time: '09:30 - 11:30',
      location: 'R.3.1'
    },
    { 
      name: 'UNIVERSAL DESIGN AND ERGONOMY',
      time: '13:30 - 16:30',
      location: 'R.3.4'
    }
  ],
  THURSDAY: [
    { 
      name: 'CIVICS',
      time: '10:30 - 12:30',
      location: 'R.3.5'
    }
  ],
  FRIDAY: [],
  SATURDAY: []
}; 