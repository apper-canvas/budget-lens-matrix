import React from "react";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Database",
  title = "No data found", 
  message = "Get started by adding your first item.",
  actionLabel,
  onAction,
  showAction = true
}) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-gray-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
        
        {showAction && onAction && actionLabel && (
          <Button onClick={onAction} className="min-w-[140px]">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-primary-50 rounded-lg">
            <ApperIcon name="Zap" className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-primary-900">Fast & Easy</p>
            <p className="text-xs text-primary-700 mt-1">Quick setup process</p>
          </div>
          <div className="p-4 bg-success-50 rounded-lg">
            <ApperIcon name="Shield" className="w-6 h-6 text-success-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-success-900">Secure</p>
            <p className="text-xs text-success-700 mt-1">Your data is protected</p>
          </div>
          <div className="p-4 bg-warning-50 rounded-lg">
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-warning-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-warning-900">Insights</p>
            <p className="text-xs text-warning-700 mt-1">Track your progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Empty;