import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className = "", 
  variant = "default",
  size = "md",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success to-success/90 text-white shadow-sm",
    warning: "bg-gradient-to-r from-warning to-warning/90 text-white shadow-sm",
    error: "bg-gradient-to-r from-error to-error/90 text-white shadow-sm",
    info: "bg-gradient-to-r from-info to-info/90 text-white shadow-sm",
    primary: "bg-gradient-to-r from-primary to-primary/90 text-white shadow-sm",
    secondary: "bg-gradient-to-r from-secondary to-secondary/90 text-white shadow-sm"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;