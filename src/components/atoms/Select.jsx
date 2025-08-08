import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children,
  className = "", 
  label = "",
  error = "",
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200",
          "focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "hover:border-gray-400",
          "bg-white",
          error && "border-error focus:ring-error/20 focus:border-error",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;