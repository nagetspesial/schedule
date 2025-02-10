"use client";

import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/header';
import { DayView } from '@/components/schedule/day-view';
import { WeekView } from '@/components/schedule/week-view';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toaster';
import { DAYS, HOURS, INITIAL_SCHEDULE, CLASS_COLORS } from '@/lib/constants/schedule';
import type { ClassItem, ScheduleForm, Day } from '@/lib/types/schedule';
import { getRandomColor, exportToJSON, validateScheduleForm, toMinutes } from '@/lib/utils/schedule';
import { useLanguage } from "@/providers/language-provider";
import type { DayKey } from "@/lib/constants/languages";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Trash2 } from 'lucide-react';
import type { TimeConflict } from '@/lib/utils/schedule';
import { Footer } from '@/components/ui/footer';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const ScheduleModal = ({ isOpen, onClose, title, children }: ModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      {title && (
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
      )}
      {children}
    </DialogContent>
  </Dialog>
);

interface ScheduleState {
  [key: string]: ClassItem[];
}

export function ScheduleApp() {
  const [schedule, setSchedule] = React.useState<ScheduleState>(INITIAL_SCHEDULE);
  const [history, setHistory] = React.useState<ScheduleState[]>([INITIAL_SCHEDULE]);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  const { addToast } = useToast();
  const [view, setView] = React.useState<'day' | 'week'>(() => {
    // Initialize from localStorage if available
    const savedView = localStorage.getItem('view');
    return (savedView as 'day' | 'week') || 'week';
  });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<Day>(() => {
    // Initialize from localStorage if available
    const savedDay = localStorage.getItem('selectedDay');
    return (savedDay as Day) || DAYS[0];
  });
  const [formData, setFormData] = React.useState<Partial<ScheduleForm>>({});
  const [courseColors, setCourseColors] = React.useState<Record<string, string>>(() => {
    // Initialize from localStorage if available
    const savedColors = localStorage.getItem('courseColors');
    return savedColors ? JSON.parse(savedColors) : {};
  });
  const { language, translateDay } = useLanguage();
  const [conflicts, setConflicts] = React.useState<TimeConflict[]>([]);
  const [formErrors, setFormErrors] = React.useState<{
    day?: boolean;
    start?: boolean;
    end?: boolean;
    timeConflict?: string;
  }>({});

  // Load saved schedule on mount
  React.useEffect(() => {
    const savedSchedule = localStorage.getItem('schedule');
    if (savedSchedule) {
      const parsedSchedule = JSON.parse(savedSchedule);
      setSchedule(parsedSchedule);
      setHistory([parsedSchedule]);
      setHistoryIndex(0);
    }
  }, []);

  // Save schedule to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }, [schedule]);

  // Save view preference to localStorage
  React.useEffect(() => {
    localStorage.setItem('view', view);
  }, [view]);

  // Save selected day to localStorage
  React.useEffect(() => {
    localStorage.setItem('selectedDay', selectedDay);
  }, [selectedDay]);

  // Update localStorage when colors change
  React.useEffect(() => {
    localStorage.setItem('courseColors', JSON.stringify(courseColors));
  }, [courseColors]);

  React.useEffect(() => {
    const colors = { ...courseColors };
    const usedColors = new Set<string>(Object.values(colors));

    Object.values(schedule).flat().forEach(item => {
      if (!colors[item.name]) {
        colors[item.name] = getRandomColor(usedColors);
        usedColors.add(colors[item.name]);
      }
    });

    if (Object.keys(colors).length !== Object.keys(courseColors).length) {
      setCourseColors(colors);
    }
  }, [schedule, courseColors]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleAddClass = () => {
    setFormData({ day: selectedDay });
    setShowModal(true);
  };

  const handleExport = () => {
    if (exportToJSON(schedule, 'college-schedule.json')) {
      addToast({
        title: 'Success',
        description: 'Schedule exported successfully',
        type: 'success',
      });
    } else {
      addToast({
        title: 'Error',
        description: 'Failed to export schedule',
        type: 'error',
      });
    }
  };

  const undo = () => {
    if (canUndo) {
      setHistoryIndex(i => i - 1);
      setSchedule(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (canRedo) {
      setHistoryIndex(i => i + 1);
      setSchedule(history[historyIndex + 1]);
    }
  };

  const handleClassClick = (item: ClassItem, day: string) => {
    const [start, end] = item.time.split(' - ').map(t => t.trim());
    setFormData({
      day: day as Day,
      name: item.name,
      start,
      end,
      time: item.time,
      type: item.type,
      location: item.location,
      instructor: item.instructor,
      notes: item.notes
    });
    setShowModal(true);
  };

  const handleDeleteClass = (day: string, classItem: ClassItem) => {
    const newSchedule = { ...schedule };
    newSchedule[day] = newSchedule[day].filter(item => item.time !== classItem.time);
    
    setSchedule(newSchedule);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newSchedule]);
    setHistoryIndex(prev => prev + 1);

    addToast({
      title: 'Success',
      description: 'Class deleted successfully',
      type: 'success',
    });

    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { day, name, start, end, type, location, instructor, notes } = formData;
    
    // Reset form errors
    setFormErrors({});

    // Track form errors
    const errors: Record<string, boolean> = {};
    let hasErrors = false;

    if (!day) {
      errors.day = true;
      hasErrors = true;
    }
    if (!start) {
      errors.start = true;
      hasErrors = true;
    }
    if (!end) {
      errors.end = true;
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      addToast({
        title: 'Error',
        description: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    // Find the original day key if we're dealing with a translated day
    const originalDay = DAYS.find(d => translateDay(d as DayKey) === day) || day;

    const validation = validateScheduleForm(
      originalDay,
      start,
      end,
      schedule,
      formData.time ? { ...formData, time: `${start} - ${end}` } as ClassItem : undefined
    );

    if (!validation.isValid) {
      setFormErrors({ timeConflict: validation.error });
      addToast({
        title: 'Error',
        description: validation.error || 'Invalid schedule data',
        type: 'error',
      });
      return;
    }

    // Handle warnings for adjacent classes
    if (validation.conflicts && validation.conflicts.length > 0) {
      setConflicts(validation.conflicts);
      validation.conflicts.forEach(conflict => {
        addToast({
          title: 'Schedule Warning',
          description: conflict.conflictMessage,
          type: 'warning',
        });
      });
    }

    const newSchedule = { ...schedule };
    const newClass: ClassItem = {
      name: name || '',
      time: `${start} - ${end}`,
      type: type || 'lecture',
      location,
      instructor,
      notes
    };

    if (formData.time && originalDay) {
      // Update existing class
      newSchedule[originalDay] = (newSchedule[originalDay] || []).map(item => 
        item.time === formData.time ? newClass : item
      );
    } else if (originalDay) {
      // Add new class
      if (!newSchedule[originalDay]) {
        newSchedule[originalDay] = [];
      }
      newSchedule[originalDay] = [...newSchedule[originalDay], newClass];
    }

    // Update color if needed
    if (name && !courseColors[name]) {
      const usedColors = new Set(Object.values(courseColors));
      setCourseColors(prev => ({
        ...prev,
        [name]: getRandomColor(usedColors)
      }));
    }

    setSchedule(newSchedule);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newSchedule]);
    setHistoryIndex(prev => prev + 1);
    
    addToast({
      title: 'Success',
      description: formData.time ? 'Class updated successfully' : 'Class added successfully',
      type: 'success',
    });

    setShowModal(false);
    setFormData({
      time: '',
      name: '',
      // Add other form fields here to reset them
    });
    setConflicts([]);
    setFormErrors({});
  };

  // Create a memoized view of the schedule
  const viewSchedule = React.useMemo(() => ({...schedule}), [schedule]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        <Header
          onAddClick={handleAddClass}
          onExportClick={handleExport}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          view={view}
          onViewChange={setView}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
          days={DAYS}
          schedule={viewSchedule}
          courseColors={courseColors}
        />
        
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {view === 'day' ? (
                <DayView
                  day={selectedDay}
                  schedule={viewSchedule[selectedDay] || []}
                  darkMode={false}
                  courseColors={courseColors}
                  onClassClick={handleClassClick}
                  onAddClick={(time) => {
                    setFormData({ day: selectedDay, start: time });
                    setShowModal(true);
                  }}
                  onDeleteClass={(classItem) => handleDeleteClass(selectedDay, classItem)}
                />
              ) : (
                <WeekView
                  schedule={Object.fromEntries(
                    DAYS.map(day => [
                      translateDay(day as DayKey),
                      schedule[day] || []
                    ])
                  )}
                  days={DAYS.map(day => translateDay(day as DayKey))}
                  darkMode={false}
                  courseColors={courseColors}
                  onClassClick={(item, translatedDay) => {
                    const originalDay = DAYS.find(d => translateDay(d as DayKey) === translatedDay);
                    if (originalDay) {
                      handleClassClick(item, originalDay);
                    }
                  }}
                  onAddClick={(translatedDay, time) => {
                    const originalDay = DAYS.find(d => translateDay(d as DayKey) === translatedDay);
                    if (originalDay) {
                      setFormData({ day: originalDay as Day, start: time });
                      setShowModal(true);
                    }
                  }}
                  onDeleteClass={(translatedDay, classItem) => {
                    const originalDay = DAYS.find(d => translateDay(d as DayKey) === translatedDay);
                    if (originalDay) {
                      handleDeleteClass(originalDay, classItem);
                    }
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />

        <ScheduleModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setFormData({});
            setFormErrors({});
          }}
          title={formData.time ? 'Edit Class' : 'Add New Class'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Name</label>
                <Input
                  placeholder="Enter class name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Day <span className="text-destructive">*</span></label>
                <Select
                  value={formData.day || selectedDay}
                  onChange={(value) => {
                    setFormData({ ...formData, day: value });
                    setFormErrors(prev => ({ ...prev, day: false, timeConflict: undefined }));
                  }}
                  options={DAYS.map(day => ({ value: day, label: translateDay(day as DayKey) }))}
                  placeholder="Select day"
                  error={formErrors.day}
                />
                {formErrors.day && (
                  <p className="text-sm text-destructive mt-1">Please select a day</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time <span className="text-destructive">*</span></label>
                  <Select
                    value={formData.start?.toString() || ''}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, start: value }));
                      setFormErrors(prev => ({ ...prev, start: false, timeConflict: undefined }));
                    }}
                    options={HOURS.map(hour => ({ value: hour, label: hour }))}
                    placeholder="Select start time"
                    error={formErrors.start}
                  />
                  {formErrors.start && (
                    <p className="text-sm text-destructive mt-1">Please select a start time</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time <span className="text-destructive">*</span></label>
                  <Select
                    value={formData.end?.toString() || ''}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, end: value }));
                      setFormErrors(prev => ({ ...prev, end: false, timeConflict: undefined }));
                    }}
                    options={HOURS.filter(hour => 
                      !formData.start || toMinutes(hour) > toMinutes(formData.start)
                    ).map(hour => ({ value: hour, label: hour }))}
                    placeholder="Select end time"
                    error={formErrors.end}
                  />
                  {formErrors.end && (
                    <p className="text-sm text-destructive mt-1">Please select an end time</p>
                  )}
                </div>
              </div>

              {formErrors.timeConflict && (
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{formErrors.timeConflict}</p>
                </div>
              )}

              {conflicts.length > 0 && (
                <div className="rounded-md bg-yellow-500/10 p-3">
                  <div className="text-sm text-yellow-600 space-y-1">
                    <p className="font-medium">Schedule Warnings:</p>
                    {conflicts.map((conflict, index) => (
                      <p key={index}>{conflict.conflictMessage}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Class Type</label>
                <Select
                  value={formData.type || 'lecture'}
                  onChange={(value) => setFormData({ ...formData, type: value })}
                  options={[
                    { value: 'lecture', label: 'Lecture' },
                    { value: 'lab', label: 'Lab' },
                    { value: 'studio', label: 'Studio' }
                  ]}
                  placeholder="Select class type"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="Enter location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Instructor</label>
                <Input
                  placeholder="Enter instructor name"
                  value={formData.instructor || ''}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  placeholder="Add any additional notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-y"
                />
              </div>

              {formData.name && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class Color</label>
                  <div className="grid grid-cols-9 gap-2">
                    {CLASS_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          "w-8 h-8 rounded-full transition-all duration-200",
                          "hover:scale-110 hover:shadow-lg",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          courseColors[formData.name!] === color && "ring-2 ring-primary ring-offset-2"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setCourseColors(prev => ({
                            ...prev,
                            [formData.name!]: color
                          }));
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t">
              {formData.time && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    handleDeleteClass(formData.day!, { ...formData, time: `${formData.start} - ${formData.end}` } as ClassItem);
                  }}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Class
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => {
                    setShowModal(false);
                    setFormData({});
                    setFormErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="min-w-[100px]">
                  {formData.time ? 'Update' : 'Add'} Class
                </Button>
              </div>
            </div>
          </form>
        </ScheduleModal>
      </div>
    </DndProvider>
  );
}