import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  className,
  gradient = "primary"
}) => {
  const gradients = {
    primary: "from-primary-500 to-primary-600",
    success: "from-success-500 to-success-600",
    warning: "from-warning-500 to-warning-600",
    error: "from-error-500 to-error-600"
  };

  const changeColors = {
    positive: "text-success-600 bg-success-50",
    negative: "text-error-600 bg-error-50", 
    neutral: "text-gray-600 bg-gray-50"
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-gray-900 to-gray-700">
                {value}
              </p>
              {change && (
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  changeColors[changeType]
                )}>
                  {change}
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br shadow-lg",
              gradients[gradient]
            )}>
              <ApperIcon name={icon} className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;