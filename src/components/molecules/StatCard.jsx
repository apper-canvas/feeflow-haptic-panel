import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ title, value, change, icon, color = "primary", trend = "up" }) => {
  const colors = {
    primary: "from-primary to-primary/90 text-white",
    secondary: "from-secondary to-secondary/90 text-white",
    success: "from-success to-success/90 text-white",
    warning: "from-warning to-warning/90 text-white",
    error: "from-error to-error/90 text-white",
    info: "from-info to-info/90 text-white"
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colors[color]} shadow-lg`}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${
            trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-gray-500"
          }`}>
            <ApperIcon 
              name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
              className="h-4 w-4 mr-1" 
            />
            {change}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900 font-display">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </Card>
  );
};

export default StatCard;