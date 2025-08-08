import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "md", 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl focus:ring-primary/50 hover:scale-105 transform",
    secondary: "bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white shadow-lg hover:shadow-xl focus:ring-secondary/50 hover:scale-105 transform",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50 hover:shadow-lg",
    ghost: "text-gray-600 hover:text-primary hover:bg-gray-50",
    danger: "bg-gradient-to-r from-error to-error/90 hover:from-error/90 hover:to-error text-white shadow-lg hover:shadow-xl focus:ring-error/50 hover:scale-105 transform"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;