import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  delayDuration?: number;
  hideDelay?: number;
  maxWidth?: number;
  interactive?: boolean;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  className,
  delayDuration = 200,
  hideDelay = 0,
  maxWidth = 300,
  interactive = false,
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();
  const tooltipId = React.useId();

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsOpen(true), delayDuration);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsOpen(false), hideDelay);
    setTimeoutId(id);
  };

  const sideToTransform = {
    top: { y: 10 },
    right: { x: -10 },
    bottom: { y: -10 },
    left: { x: 10 },
  };

  const sideToPosition = {
    top: "-top-1 left-1/2 -translate-x-1/2 -translate-y-full",
    right: "top-1/2 -right-1 translate-x-full -translate-y-1/2",
    bottom: "-bottom-1 left-1/2 -translate-x-1/2 translate-y-full",
    left: "top-1/2 -left-1 -translate-x-full -translate-y-1/2",
  };

  const alignments = {
    start: side === "top" || side === "bottom" ? "left-0" : "top-0",
    center: "",
    end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
  };

  return (
    <div 
      className="relative inline-block" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {React.cloneElement(children as React.ReactElement, {
        "aria-describedby": tooltipId,
      })}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95, ...sideToTransform[side] }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0, 
              y: 0,
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              ...sideToTransform[side],
              transition: {
                duration: 0.1
              }
            }}
            style={{ maxWidth }}
            className={cn(
              "absolute z-50 px-3 py-1.5",
              "rounded-md bg-popover text-popover-foreground shadow-md text-sm",
              "select-none break-words",
              interactive && "pointer-events-auto",
              !interactive && "pointer-events-none",
              sideToPosition[side],
              alignments[align],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 