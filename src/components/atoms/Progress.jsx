import React from "react";
import { cn } from "@/utils/cn";

const Progress = React.forwardRef(({ 
  className, 
  value = 0, 
  max = 100,
  variant = "primary",
  showPercentage = false,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: "from-primary-500 to-primary-600",
    success: "from-success-500 to-success-600", 
    warning: "from-warning-500 to-warning-600",
    error: "from-error-500 to-error-600"
  };
  
  return (
    <div className="flex items-center gap-3">
      <div
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full bg-gradient-to-r transition-all duration-500 ease-out",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;