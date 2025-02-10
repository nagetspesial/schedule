import * as React from "react";
import { LucideIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link" | "subtle";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    icon: Icon,
    iconPosition = "left",
    loading = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
      "ring-offset-background"
    );
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:brightness-110 active:brightness-90",
      destructive: "bg-destructive text-destructive-foreground hover:brightness-110 active:brightness-90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary",
      subtle: "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30",
    };

    const sizes = {
      default: "h-10 py-2 px-4 text-sm",
      sm: "h-9 px-3 text-xs rounded-md",
      lg: "h-11 px-8 text-base rounded-md",
      icon: "h-10 w-10 p-2",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && "relative text-transparent transition-none hover:text-transparent",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-current" />
          </div>
        )}
        <span className={cn(
          "flex items-center gap-2",
          loading && "invisible"
        )}>
          {Icon && iconPosition === "left" && !loading && (
            <Icon className={cn("w-4 h-4", children ? "mr-2" : "")} aria-hidden="true" />
          )}
          {children}
          {Icon && iconPosition === "right" && !loading && (
            <Icon className={cn("w-4 h-4", children ? "ml-2" : "")} aria-hidden="true" />
          )}
        </span>
      </button>
    );
  }
); 