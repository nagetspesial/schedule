"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T> {
  value: T | '';
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled,
  error,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState<number>(0);
  const [dropdownWidth, setDropdownWidth] = React.useState<number>(0);
  const [isTouched, setIsTouched] = React.useState(false);

  // Calculate widths for button and dropdown
  React.useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'nowrap';
    tempDiv.style.fontSize = '14px'; // Match text-sm
    tempDiv.style.padding = '0 16px'; // Account for padding
    document.body.appendChild(tempDiv);

    // Calculate button width based on selected value or placeholder
    const selectedText = options.find(opt => opt.value === value)?.label || placeholder;
    tempDiv.textContent = selectedText;
    const currentTextWidth = tempDiv.offsetWidth;
    
    // Calculate dropdown width based on all options
    const maxTextWidth = options.reduce((max, opt) => {
      tempDiv.textContent = opt.label;
      return Math.max(max, tempDiv.offsetWidth);
    }, currentTextWidth);

    document.body.removeChild(tempDiv);

    // Add extra space for icons and padding
    setButtonWidth(currentTextWidth + 56); // Increased from 48 to 56 to ensure chevron is covered
    setDropdownWidth(maxTextWidth + 64); // Account for check icon (16px) + padding (48px)
  }, [options, value, placeholder]);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className="relative inline-block"
      ref={containerRef}
      style={{ 
        width: isOpen ? dropdownWidth : buttonWidth,
        transition: 'width 200ms ease-out'
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (!disabled) {
            setIsOpen(!isOpen);
            setIsTouched(true);
          }
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "transition-all duration-200 ease-out",
          disabled && "cursor-not-allowed opacity-50",
          error && isTouched && "border-destructive ring-destructive",
          !error && isOpen && "ring-2 ring-ring ring-offset-2",
          className
        )}
        disabled={disabled}
      >
        <span className={cn(
          "block flex-1 text-left whitespace-nowrap",
          !value && "text-muted-foreground",
          error && isTouched && "text-destructive"
        )}>
          {options.find(opt => opt.value === value)?.label || placeholder}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 flex-shrink-0 transition-transform duration-200 ml-2",
          error && isTouched ? "text-destructive" : "opacity-50",
          isOpen && "transform rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 mt-1 w-full rounded-md border bg-popover py-1.5 shadow-md",
              "max-h-[300px] overflow-y-auto scrollbar-custom"
            )}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "relative w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none",
                  "transition-colors duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground",
                  value === option.value && "bg-accent/50 font-medium"
                )}
              >
                <span className="block truncate">{option.label}</span>
                {value === option.value && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 