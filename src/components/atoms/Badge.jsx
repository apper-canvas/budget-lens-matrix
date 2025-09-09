import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 hover:from-primary-200 hover:to-primary-300",
    success: "bg-gradient-to-r from-success-100 to-success-200 text-success-800 hover:from-success-200 hover:to-success-300",
    warning: "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 hover:from-warning-200 hover:to-warning-300",
    error: "bg-gradient-to-r from-error-100 to-error-200 text-error-800 hover:from-error-200 hover:to-error-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export default Badge;