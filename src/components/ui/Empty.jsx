import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "FileText"
}) => {
  return (
    <div className="bg-surface rounded-xl shadow-lg p-12 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="inline-flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;