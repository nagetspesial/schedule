"use client";

import type { ClassItem, ScheduleData, ScheduleStats } from '../types/schedule';
import { CLASS_COLORS } from '../constants/schedule';

// Time Utils
export const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Color Utils
export const getContrastingTextColor = (bgColor: string): string => {
  const lightColors = ['#F2B134', '#A1CDA8', '#F59E0B', '#10B981'];
  return lightColors.includes(bgColor) ? 'text-gray-900' : 'text-white';
};

export const getRandomColor = (usedColors: Set<string>): string => {
  const availableColors = CLASS_COLORS.filter(color => !usedColors.has(color));
  if (availableColors.length === 0) return CLASS_COLORS[Math.floor(Math.random() * CLASS_COLORS.length)];
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};

export interface TimeConflict {
  existingClass: ClassItem;
  conflictType: 'overlap' | 'adjacent' | 'contained';
  conflictMessage: string;
}

export function detectTimeConflicts(
  day: string,
  start: string,
  end: string,
  schedule: ScheduleData,
  editingClass?: ClassItem
): TimeConflict[] {
  const conflicts: TimeConflict[] = [];
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  
  const daySchedule = schedule[day] || [];
  
  daySchedule.forEach((existingClass) => {
    if (editingClass && existingClass.time === editingClass.time) return;

    const [existingStart, existingEnd] = existingClass.time.split(' - ').map(t => t.trim());
    const existingStartMin = toMinutes(existingStart);
    const existingEndMin = toMinutes(existingEnd);

    // Check for direct overlap
    if (
      (startMinutes >= existingStartMin && startMinutes < existingEndMin) ||
      (endMinutes > existingStartMin && endMinutes <= existingEndMin) ||
      (startMinutes <= existingStartMin && endMinutes >= existingEndMin)
    ) {
      conflicts.push({
        existingClass,
        conflictType: 'overlap',
        conflictMessage: `Conflicts with ${existingClass.name} (${existingClass.time})`
      });
    }

    // Check for adjacent classes (less than 15 minutes gap)
    const MIN_GAP = 15;
    if (
      (Math.abs(startMinutes - existingEndMin) < MIN_GAP) ||
      (Math.abs(endMinutes - existingStartMin) < MIN_GAP)
    ) {
      conflicts.push({
        existingClass,
        conflictType: 'adjacent',
        conflictMessage: `Less than ${MIN_GAP} minutes gap with ${existingClass.name}`
      });
    }
  });

  return conflicts;
}

export const validateScheduleForm = (
  day: string,
  start: string,
  end: string,
  schedule: ScheduleData,
  editingClass?: ClassItem
): { isValid: boolean; error?: string; conflicts?: TimeConflict[] } => {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  
  if (endMinutes - startMinutes < 60) {
    return { isValid: false, error: 'Class duration must be at least 1 hour' };
  }

  if (startMinutes >= endMinutes) {
    return { isValid: false, error: 'Start time must be before end time' };
  }

  const conflicts = detectTimeConflicts(day, start, end, schedule, editingClass);
  
  if (conflicts.length > 0) {
    const conflictMessages = conflicts
      .filter(c => c.conflictType === 'overlap')
      .map(c => c.conflictMessage);
    
    if (conflictMessages.length > 0) {
      return { 
        isValid: false, 
        error: 'Schedule conflicts detected', 
        conflicts 
      };
    }

    // Return warnings for adjacent classes
    return { 
      isValid: true, 
      conflicts: conflicts.filter(c => c.conflictType === 'adjacent')
    };
  }

  return { isValid: true };
};

export const generateScheduleStats = (schedule: ScheduleData, days: string[]): ScheduleStats => {
  if (!schedule || Object.keys(schedule).length === 0) {
    return {
      totalClasses: 0,
      classesPerDay: days.map(day => ({ day, count: 0 })),
      busyDay: { day: days[0], count: 0 },
      totalHours: 0,
      averagePerDay: '0',
      activeDays: 0,
    };
  }

  const totalClasses = Object.values(schedule).flat().length;
  const classesPerDay = Object.entries(schedule).map(([day, classes]) => ({
    day,
    count: classes.length,
  }));
  const busyDay = [...classesPerDay].sort((a, b) => b.count - a.count)[0];
  
  const totalHours = Object.values(schedule)
    .flat()
    .reduce((acc: number, cls: ClassItem) => {
      const [startTime, endTime] = cls.time.split(' - ').map(t => t.trim());
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      const start = startHours * 60 + startMinutes;
      const end = endHours * 60 + endMinutes;
      
      return acc + (end - start) / 60;
    }, 0);

  const activeDays = days.filter(day => schedule[day]?.length > 0);

  return { 
    totalClasses, 
    classesPerDay, 
    busyDay, 
    totalHours: Math.round(totalHours * 10) / 10,
    averagePerDay: activeDays.length ? (totalClasses / activeDays.length).toFixed(1) : '0',
    activeDays: activeDays.length,
  };
};

export const exportToJSON = (schedule: ScheduleData, filename = 'schedule.json'): boolean => {
  try {
    const blob = new Blob([JSON.stringify(schedule, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    return false;
  }
}; 