import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Modal = forwardRef(({ 
  children, 
  isOpen, 
  onClose, 
  title = "",
  className = "",
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
        <div
          ref={ref}
          className={cn(
            "relative bg-surface rounded-2xl shadow-2xl w-full animate-scale",
            "border border-gray-100 backdrop-blur-md",
            sizes[size],
            className
          )}
          {...props}
        >
          {title && (
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;