import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { Clock, MapPin, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import type { DayViewProps, ClassItem } from '@/lib/types/schedule';
import { toMinutes, getContrastingTextColor } from '@/lib/utils/schedule';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/providers/language-provider';
import type { DayKey } from '@/lib/constants/languages';

interface DragItem {
  index: number;
  day: string;
}

interface ClassCardProps {
  item: ClassItem;
  day: string;
  color?: string;
  onClick: () => void;
  onDelete: () => void;
  darkMode: boolean;
  index: number;
  moveClass: (dragIndex: number, hoverIndex: number) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({
  item,
  day,
  color,
  onClick,
  onDelete,
  darkMode,
  index,
  moveClass,
}) => {
  const { t } = useLanguage();
  const [{ isDragging }, dragRef] = useDrag({
    type: 'CLASS',
    item: { index, day } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CLASS',
    hover: (draggedItem: DragItem) => {
      if (draggedItem.index !== index) {
        moveClass(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const ref = (node: HTMLDivElement | null) => {
    dragRef(node);
    dropRef(node);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card
        className={cn(
          "transition-all duration-200 border-l-4 mb-3 relative group",
          isDragging ? "shadow-2xl scale-105" : "shadow-md hover:shadow-lg",
          color ? `border-l-[${color}]` : "border-l-primary",
          darkMode ? "bg-neutral-800" : "bg-card"
        )}
        onClick={onClick}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-base">{item.name}</h3>
            </div>
            <Tooltip content={t('delete')}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="delete-button"
              >
                <Trash2 className="w-4 h-4 text-white/70 hover:text-white" />
              </button>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{item.time}</span>
            </div>
            {item.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </div>
            )}
            {item.notes && (
              <p className="text-sm italic text-muted-foreground">{item.notes}</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const DayView: React.FC<DayViewProps> = ({
  schedule = [],
  day,
  darkMode,
  courseColors,
  onClassClick,
  onAddClick,
  onDeleteClass,
}) => {
  const { t, translateDay } = useLanguage();

  const sortedSchedule = useMemo(() => {
    return [...schedule].sort((a, b) => {
      const [startA] = a.time.split(' - ');
      const [startB] = b.time.split(' - ');
      return toMinutes(startA) - toMinutes(startB);
    });
  }, [schedule]);

  const moveClass = (dragIndex: number, hoverIndex: number) => {
    const draggedClass = sortedSchedule[dragIndex];
    const updatedSchedule = [...sortedSchedule];
    updatedSchedule.splice(dragIndex, 1);
    updatedSchedule.splice(hoverIndex, 0, draggedClass);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-background/50 p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">{translateDay(day as DayKey)}</h2>
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors",
            schedule.length > 0 
              ? "bg-primary/10 text-primary hover:bg-primary/20" 
              : "bg-muted text-muted-foreground"
          )}>
            {schedule.length} {t('classes')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content={t('addClass')}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddClick('09:00')}
              className="relative overflow-hidden group hover:border-primary/50"
            >
              <span className="absolute inset-0 bg-primary/10 w-0 group-hover:w-full transition-all duration-200"/>
              <Clock className="w-4 h-4 mr-2" />
              <span className="relative">{t('addClass')}</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Classes List */}
      <AnimatePresence mode="popLayout">
        {sortedSchedule.length > 0 ? (
          <div className={cn(
            "space-y-2",
            sortedSchedule.length > 3 && "flex-1 overflow-y-auto pr-2 scrollbar-custom"
          )}>
            {sortedSchedule.map((item, index) => (
              <ClassCard
                key={`${item.name}-${item.time}`}
                item={item}
                day={day}
                color={courseColors[item.name]}
                onClick={() => onClassClick(item, day)}
                onDelete={() => onDeleteClass(item)}
                darkMode={darkMode}
                index={index}
                moveClass={moveClass}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-12 text-center border-dashed">
              <div className="space-y-3">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-muted-foreground">{t('noClasses')} {translateDay(day as DayKey)}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddClick('09:00')}
                    className="gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    {t('addFirstClass')}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 