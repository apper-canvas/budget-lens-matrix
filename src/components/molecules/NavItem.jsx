import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105"
            : "text-gray-700 hover:text-primary-700 hover:bg-primary-50 hover:transform hover:scale-105 hover:shadow-md",
          className
        )
      }
    >
      <ApperIcon name={icon} className="w-5 h-5" />
      <span>{children}</span>
    </NavLink>
  );
};

export default NavItem;