import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className = "", 
  hover = false,
  gradient = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-surface rounded-xl shadow-lg transition-all duration-200";
  const hoverStyles = hover ? "hover:shadow-xl hover:scale-[1.02] transform cursor-pointer" : "";
  const gradientStyles = gradient ? "bg-gradient-to-br from-surface to-gray-50" : "";
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, hoverStyles, gradientStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;