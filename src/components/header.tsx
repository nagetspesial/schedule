"use client";

import * as React from "react";
import { Calendar, Download, PlusCircle, Search, Undo2, Redo2, Keyboard, Menu, MoreVertical, Settings, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { useKeyboardShortcuts } from "@/lib/hooks";
import type { HeaderProps } from "@/lib/types/schedule";
import { Select } from "@/components/ui/select";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/providers/language-provider";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import type { TranslationKey, DayKey } from "@/lib/constants/languages";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";

// Extracted components for better organization and reusability
const SearchBar = React.memo(({ 
  searchQuery, 
  onSearchChange, 
  inputRef,
  placeholder,
  isMobile = false,
  showSearch,
  setShowSearch,
}: { 
  searchQuery: string; 
  onSearchChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  placeholder: string;
  isMobile?: boolean;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (isMobile) {
    return (
      <div className="relative">
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 top-0 w-full max-w-[280px]"
          >
            <Input
              ref={inputRef}
              type="search"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-9 h-9"
              onBlur={() => {
                if (!searchQuery) setIsExpanded(false);
              }}
              autoFocus
            />
            <Search 
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" 
              aria-hidden="true" 
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="relative"
          >
            <Search className="h-4 w-4" />
            {searchQuery && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex-1 max-w-md">
      <Search 
        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" 
        aria-hidden="true" 
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 h-9"
        aria-label={placeholder}
      />
      <kbd className="pointer-events-none absolute right-2.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  );
});

SearchBar.displayName = "SearchBar";

function ViewControls({
  view,
  onViewChange,
  selectedDay,
  onDayChange,
  days,
  t,
  translateDay,
}: {
  view: 'day' | 'week';
  onViewChange: (view: 'day' | 'week') => void;
  selectedDay: DayKey;
  onDayChange: (day: DayKey) => void;
  days: readonly DayKey[];
  t: (key: TranslationKey) => string;
  translateDay: (day: DayKey) => string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative z-20">
        <Select
          value={view}
          onChange={onViewChange as (value: string) => void}
          options={[
            { value: 'week', label: t('weekView') },
            { value: 'day', label: t('dayView') }
          ]}
          className={cn(
            "transition-all",
            "hover:ring-2 hover:ring-primary/20",
            "focus:ring-2 focus:ring-primary/40",
            "bg-background/40 backdrop-blur-sm"
          )}
        />
      </div>
      
      {view === 'day' && (
        <div className="relative z-10 ml-2">
          <Select
            value={selectedDay}
            onChange={onDayChange as (value: string) => void}
            options={days.map(day => ({
              value: day,
              label: translateDay(day)
            }))}
            className={cn(
              "transition-all",
              "hover:ring-2 hover:ring-primary/20",
              "focus:ring-2 focus:ring-primary/40",
              "bg-background/40 backdrop-blur-sm"
            )}
          />
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  isOpen,
  onClose,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportClick,
  t,
  view,
  onViewChange,
  selectedDay,
  onDayChange,
  days,
  translateDay,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportClick: () => void;
  t: (key: TranslationKey) => string;
  view: 'day' | 'week';
  onViewChange: (view: 'day' | 'week') => void;
  selectedDay: DayKey;
  onDayChange: (day: DayKey) => void;
  days: readonly DayKey[];
  translateDay: (day: DayKey) => string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[400px] p-0 gap-0 h-[85vh] max-h-[600px] flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background">
          <DialogTitle className="text-lg font-semibold">{t('menu')}</DialogTitle>
          <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('language')}</label>
              <div className="relative">
                <LanguageToggle />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('theme')}</label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-accent/50">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('settings')}</label>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 className="w-4 h-4" />
                {t('undo')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 className="w-4 h-4" />
                {t('redo')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={onExportClick}
              >
                <Download className="w-4 h-4" />
                {t('export')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const HistoryControls = React.memo(({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  t,
}: {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  t: (key: TranslationKey) => string;
}) => (
  <div className="flex items-center gap-1">
    <Button
      variant="ghost"
      size="icon"
      onClick={onUndo}
      disabled={!canUndo}
      className="h-9 w-9"
    >
      <Undo2 className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={onRedo}
      disabled={!canRedo}
      className="h-9 w-9"
    >
      <Redo2 className="h-4 w-4" />
    </Button>
  </div>
));

HistoryControls.displayName = "HistoryControls";

const ActionButtons = React.memo(({
  onAddClick,
  onExportClick,
  t,
}: {
  onAddClick: () => void;
  onExportClick: () => void;
  t: (key: TranslationKey) => string;
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onExportClick}
        className={cn(
          "h-9 w-9 transition-all",
          "hover:ring-2 hover:ring-primary/20",
          "hover:bg-accent/50"
        )}
      >
        <Download className="h-4 w-4" />
      </Button>
      <div className="flex-shrink-0">
        <ThemeToggle />
      </div>
      <div className="relative">
        <LanguageToggle />
      </div>
      <Button
        variant="default"
        onClick={onAddClick}
        className={cn(
          "h-9 px-4 transition-all duration-200",
          isDark 
            ? "bg-primary/90 hover:bg-primary text-primary-foreground"
            : "bg-primary hover:bg-primary/90 text-primary-foreground",
          "hover:scale-[1.02] active:scale-[0.98]",
          "shadow-sm hover:shadow"
        )}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        <span className="font-medium">{t('addClass')}</span>
      </Button>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

export function Header({
  onAddClick,
  onExportClick,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  view,
  onViewChange,
  selectedDay,
  onDayChange,
  days,
  schedule,
  courseColors,
}: HeaderProps) {
  const { t, translateDay } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const isMac = React.useMemo(() => typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0, []);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && view === 'day') {
        onViewChange('week');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [view, onViewChange]);

  const shortcuts = useKeyboardShortcuts([
    { 
      key: "z", 
      ctrlKey: !isMac, 
      metaKey: isMac, 
      description: t("undo"), 
      action: () => canUndo && onUndo() 
    },
    { 
      key: "z", 
      ctrlKey: !isMac, 
      metaKey: isMac, 
      shiftKey: true, 
      description: t("redo"), 
      action: () => canRedo && onRedo() 
    },
    { 
      key: "e", 
      ctrlKey: !isMac, 
      metaKey: isMac, 
      description: t("export"), 
      action: onExportClick 
    },
    { 
      key: "n", 
      ctrlKey: !isMac, 
      metaKey: isMac, 
      description: t("addClass"), 
      action: onAddClick 
    },
  ]);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b",
      "bg-gradient-to-b from-background/95 to-background/90",
      "backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
      "shadow-sm",
      isDark ? "border-neutral-800/60" : "border-slate-200/60"
    )}>
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left section - Mobile */}
        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-accent/50 active:bg-accent/70"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Left section - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2.5 pr-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight">{t('schedule')}</h1>
          </div>
          <div className="hidden md:flex items-center">
            <ViewControls
              view={view}
              onViewChange={onViewChange}
              selectedDay={selectedDay}
              onDayChange={onDayChange}
              days={days}
              t={t}
              translateDay={translateDay}
            />
          </div>
        </div>

        {/* Right section - Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-accent/50 active:bg-accent/70"
            onClick={onAddClick}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Right section - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <HistoryControls
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            t={t}
          />
          <div className="h-4 w-px bg-border/60 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-accent/50 transition-colors"
            onClick={() => setShowKeyboardShortcuts(true)}
          >
            <Keyboard className="h-4 w-4" />
          </Button>
          <ActionButtons
            onAddClick={onAddClick}
            onExportClick={onExportClick}
            t={t}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onExportClick={onExportClick}
        t={t}
        view={view}
        onViewChange={onViewChange}
        selectedDay={selectedDay}
        onDayChange={onDayChange}
        days={days}
        translateDay={translateDay}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcuts
        shortcuts={shortcuts}
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </header>
  );
} 