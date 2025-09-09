import React from "react";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required, 
  children, 
  className 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error-600 flex items-center gap-1">
          <span className="font-medium">Error:</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;