import * as React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "filled" | "glass";
  hoverable?: boolean;
  interactive?: boolean;
  loading?: boolean;
  selected?: boolean;
  error?: boolean;
  success?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    icon: Icon, 
    variant = "default", 
    hoverable = false,
    interactive = false,
    loading = false,
    selected = false,
    error = false,
    success = false,
    children, 
    ...props 
  }, ref) => {
    const variants = {
      default: "bg-background shadow-md",
      outline: "border border-border bg-transparent",
      filled: "bg-muted",
      glass: "glass-effect",
    };

    const statusStyles = cn(
      error && "border-destructive/50",
      success && "border-green-500/50",
      selected && "ring-2 ring-primary ring-offset-2"
    );

    const interactiveStyles = cn(
      interactive && "cursor-pointer",
      hoverable && "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
      interactive && "active:scale-[0.98]"
    );

    return (
      <motion.div
        ref={ref}
        initial={interactive ? { scale: 1 } : false}
        whileHover={interactive ? { scale: 1.02 } : false}
        whileTap={interactive ? { scale: 0.98 } : false}
        className={cn(
          "rounded-lg overflow-hidden",
          variants[variant],
          statusStyles,
          interactiveStyles,
          loading && "animate-pulse",
          className
        )}
        {...props}
      >
        {(title || subtitle || Icon) && (
          <div className="p-4 border-b border-border/10">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 rounded-md bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="font-semibold text-lg truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-muted-foreground truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={cn(
          "p-4",
          loading && "animate-pulse"
        )}>
          {children}
        </div>
      </motion.div>
    );
  }
); 