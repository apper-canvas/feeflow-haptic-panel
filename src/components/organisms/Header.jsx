import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuClick, action }) => {
  return (
    <header className="bg-surface shadow-sm border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="h-6 w-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 font-display">{title}</h2>
        </div>
        {action && (
          <div className="flex items-center space-x-4">
            {action}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;