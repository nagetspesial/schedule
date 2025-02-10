import * as React from 'react';
import { Pencil, Trash2, Palette, Plus, MapPin, ChevronLeft, ChevronRight, BookOpen, Beaker, Info, PlusCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import type { ClassItem } from '@/lib/types/schedule';
import { cn } from '@/lib/utils';
import type { DayKey } from '@/lib/constants/languages';
import { HOURS } from '@/lib/constants/schedule';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

interface ScheduleState {
  [key: string]: ClassItem[];
}

interface TimeSlotProps {
  day: string;
  time: string;
  classItem?: ClassItem;
  color?: string;
  darkMode: boolean;
  onClick: () => void;
  onAdd: () => void;
  onDelete?: () => void;
  rowSpan?: number;
}

interface ClassTypeInfo {
  type: 'lecture' | 'lab' | 'studio';
  icon: typeof BookOpen | typeof Beaker | typeof Palette;
  pattern: string;
}

const CLASS_TYPES: Record<string, ClassTypeInfo> = {
  lecture: { type: 'lecture', icon: BookOpen, pattern: 'bg-grid-slate-100' },
  lab: { type: 'lab', icon: Beaker, pattern: 'bg-dot-slate-100' },
  studio: { type: 'studio', icon: Palette, pattern: 'bg-cross-slate-100' }
};

const TimeSlot: React.FC<TimeSlotProps> = ({
  day,
  time,
  classItem,
  color,
  darkMode,
  onClick,
  onAdd,
  onDelete,
  rowSpan = 1,
}) => {
  const { t } = useLanguage();
  const classType = classItem?.type || 'lecture';
  const typeInfo = CLASS_TYPES[classType];

  if (classItem) {
    return (
      <div
        style={{ 
          gridRow: `span ${rowSpan}`,
          height: `${rowSpan * 100}%`,
        }}
        className="relative w-full group"
      >
        <div 
          className={cn(
            "class-block group transition-all",
            typeInfo.pattern,
            "hover:scale-[1.02] hover:z-10"
          )}
          style={{ borderLeftColor: color || 'var(--border)' }}
        >
          <button
            onClick={onClick}
            className="w-full h-full"
          >
            <div className="class-block-content">
              <div className="flex items-center gap-2 mb-1">
                <typeInfo.icon className="w-4 h-4 opacity-70" />
                <div className="class-name">{classItem.name}</div>
              </div>
              {classItem.location && (
                <div className="class-location">
                  <MapPin className="w-3 h-3 inline-block mr-1" />
                  {classItem.location}
                </div>
              )}
            </div>
          </button>
          
          {/* Hover Details */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/95 backdrop-blur-sm p-4 flex flex-col justify-center">
            <div className="text-sm font-medium">{classItem.name}</div>
            {classItem.instructor && (
              <div className="text-xs mt-2">
                {t('instructor')}: {classItem.instructor}
              </div>
            )}
            {classItem.notes && (
              <div className="text-xs mt-2 italic">
                {classItem.notes}
              </div>
            )}
          </div>

          <div className="flex items-center absolute top-2 right-2 gap-1">
            <Tooltip content={t('edit')}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="edit-button"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </Tooltip>
            {onDelete && (
              <Tooltip content={t('delete')}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="delete-button"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-cell group">
      <button 
        onClick={onAdd}
        className="add-class-button"
        title={t('addClass')}
      >
        <Plus className="w-4 h-4" />
      </button>
      <div className="empty-slot">{t('free')}</div>
    </div>
  );
};

interface MobileTimeSlotProps {
  day: string;
  time: string;
  classItem?: ClassItem;
  color?: string;
  darkMode: boolean;
  onClick: () => void;
  onAdd: () => void;
  onDelete?: () => void;
  rowSpan?: number;
}

const MobileTimeSlot: React.FC<MobileTimeSlotProps> = ({
  day,
  time,
  classItem,
  color,
  darkMode,
  onClick,
  onAdd,
  onDelete,
  rowSpan = 1,
}) => {
  const { t } = useLanguage();

  if (!classItem) {
    return (
      <button
        onClick={onAdd}
        className={cn(
          "w-full h-11 flex items-center justify-center",
          "border-b border-border/5 hover:bg-accent/50",
          "transition-colors duration-200"
        )}
      >
        <span className="sr-only">{t('addClass')}</span>
        <PlusCircle className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full p-2 min-h-[88px]",
        "border-b border-border/5",
        "transition-all duration-200",
        color ? `bg-${color}/10` : "bg-primary/10"
      )}
      style={{ gridRow: `span ${rowSpan}` }}
    >
      <button
        onClick={onClick}
        className="w-full h-full text-left space-y-1"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm line-clamp-2">{classItem.name}</h3>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded-md hover:bg-background/80"
            >
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{time}</span>
        </div>
        {classItem.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{classItem.location}</span>
          </div>
        )}
      </button>
    </div>
  );
};

interface ProcessedSchedule {
  [key: string]: {
    [time: string]: {
      class: ClassItem;
      span: number;
    } | undefined;
  };
}

export interface WeekViewProps {
  schedule: ScheduleState;
  days: string[];  // These are already translated days
  darkMode: boolean;
  courseColors: Record<string, string>;
  onClassClick: (item: ClassItem, day: string) => void;
  onAddClick: (day: string, time: string) => void;
  onDeleteClass: (day: string, classItem: ClassItem) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  schedule,
  days,
  darkMode,
  courseColors,
  onClassClick,
  onAddClick,
  onDeleteClass,
}) => {
  const { t } = useLanguage();
  const [selectedMobileDay, setSelectedMobileDay] = React.useState(() => {
    // Get current day name and find its translated version
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentDayIndex = days.findIndex(day => 
      day.toLowerCase().includes(currentDay)
    );
    return days[currentDayIndex !== -1 ? currentDayIndex : 0];
  });
  const [isMobile, setIsMobile] = React.useState(false);

  // Process schedule data
  const processedSchedule = React.useMemo(() => {
    const processed: ProcessedSchedule = {};
    
    // Initialize empty schedule for all translated days
    days.forEach(translatedDay => {
      processed[translatedDay] = {};
    });

    // Process each day's schedule
    Object.entries(schedule).forEach(([translatedDay, classes]) => {
      processed[translatedDay] = processed[translatedDay] || {};
      
      classes.forEach(classItem => {
        const [startTime] = classItem.time.split(' - ');
        const [endTime] = classItem.time.split(' - ').slice(-1);
        
        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        const span = endHour - startHour;
        
        processed[translatedDay][startTime] = {
          class: classItem,
          span: span
        };
      });
    });

    return processed;
  }, [schedule, days]);

  React.useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const shouldSkipSlot = (translatedDay: string, time: string): boolean => {
    const [hour, minutes] = time.split(':').map(Number);
    const currentTimeInMinutes = hour * 60 + minutes;

    for (const slotTime of HOURS) {
      const [slotHour, slotMinutes] = slotTime.split(':').map(Number);
      const slotTimeInMinutes = slotHour * 60 + slotMinutes;
      
      if (slotTimeInMinutes >= currentTimeInMinutes) continue;

      const slot = processedSchedule[translatedDay]?.[slotTime];
      if (slot) {
        const slotEndTimeInMinutes = slotTimeInMinutes + (slot.span * 60);
        if (currentTimeInMinutes < slotEndTimeInMinutes) {
          return true;
        }
      }
    }
    return false;
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Day Tabs */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/5">
          <div className="flex overflow-x-auto scrollbar-none px-4 py-2">
            {days.map((translatedDay) => (
              <button
                key={translatedDay}
                onClick={() => setSelectedMobileDay(translatedDay)}
                className={cn(
                  "flex-none px-4 py-2 text-sm font-medium relative",
                  selectedMobileDay === translatedDay
                    ? "text-primary"
                    : "text-muted-foreground",
                  schedule[translatedDay]?.length > 0 && selectedMobileDay !== translatedDay
                    ? "text-primary/70"
                    : ""
                )}
              >
                {translatedDay}
                {schedule[translatedDay]?.length > 0 && (
                  <span className="ml-1.5 text-xs">
                    ({schedule[translatedDay].length})
                  </span>
                )}
                {selectedMobileDay === translatedDay && (
                  <motion.div
                    layoutId="activeDay"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Schedule Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMobileDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="divide-y divide-border/5"
            >
              {(schedule[selectedMobileDay] || []).map((classItem) => (
                <div
                  key={`${selectedMobileDay}-${classItem.time}`}
                  className="p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium">{classItem.name}</h4>
                    <button
                      onClick={() => onDeleteClass(selectedMobileDay, classItem)}
                      className="p-1 rounded-md hover:bg-accent/50"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{classItem.time}</span>
                    </div>
                    {classItem.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{classItem.location}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onClassClick(classItem, selectedMobileDay)}
                    className="w-full justify-start text-primary"
                  >
                    {t('edit')}
                  </Button>
                </div>
              ))}
              {(!schedule[selectedMobileDay] || schedule[selectedMobileDay].length === 0) && (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('noClasses')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddClick(selectedMobileDay, '09:00')}
                    className="mt-4"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t('addFirstClass')}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="h-full grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[60px_1fr] md:grid-cols-[60px_repeat(6,1fr)] schedule-header">
        {/* Time Header */}
        <div className="p-2 border-r border-border/20 font-medium text-center text-xs text-muted-foreground backdrop-blur-xl bg-background/40">
          {t('time')}
        </div>
        {/* Day Headers */}
        {days.map((translatedDay: string) => (
          <div
            key={translatedDay}
            className={cn(
              "p-2 font-medium text-center border-r last:border-r-0 border-border/20",
              "transition-all duration-200 backdrop-blur-xl bg-background/40",
              "hover:bg-background/60",
              schedule[translatedDay]?.length 
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-sm">{translatedDay}</span>
              {schedule[translatedDay]?.length > 0 && (
                <span className="text-xs font-normal opacity-70">
                  {schedule[translatedDay].length} {schedule[translatedDay].length === 1 ? t('class') : t('classes')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-[60px_1fr] md:grid-cols-[60px_repeat(6,1fr)] grid-rows-[repeat(14,1fr)] overflow-hidden">
        {HOURS.map((time) => (
          <React.Fragment key={time}>
            {/* Time Column */}
            <div className="time-column sticky left-0 border-r border-border/20">
              {time}
            </div>
            {/* Schedule Slots */}
            {days.map((translatedDay: string) => {
              if (shouldSkipSlot(translatedDay, time)) {
                return <div key={`${translatedDay}-${time}-skip`} className="border-b border-r border-border/20" />;
              }

              const slot = processedSchedule[translatedDay]?.[time];
              
              return (
                <div 
                  key={`${translatedDay}-${time}`} 
                  className="schedule-cell border-r border-b border-border/20"
                >
                  <TimeSlot
                    day={translatedDay}
                    time={time}
                    classItem={slot?.class}
                    color={slot?.class ? courseColors[slot.class.name] : undefined}
                    darkMode={darkMode}
                    onClick={() => {
                      if (slot?.class) onClassClick(slot.class, translatedDay);
                    }}
                    onAdd={() => onAddClick(translatedDay, time)}
                    onDelete={slot?.class ? () => onDeleteClass(translatedDay, slot.class) : undefined}
                    rowSpan={slot?.span}
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};