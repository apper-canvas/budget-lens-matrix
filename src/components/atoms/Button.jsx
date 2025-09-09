import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    secondary: "text-primary-700 bg-white border border-primary-200 hover:bg-primary-50 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:scale-[1.01]",
    success: "text-white bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 focus:ring-success-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    warning: "text-white bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800 focus:ring-warning-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    error: "text-white bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 focus:ring-error-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    ghost: "text-gray-700 hover:text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    outline: "text-gray-700 border border-gray-300 hover:border-primary-500 hover:text-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;