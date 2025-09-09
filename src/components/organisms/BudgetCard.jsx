import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Progress from "@/components/atoms/Progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { budgetService } from "@/services/api/budgetService";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const BudgetCard = ({ budget, category, spent, onBudgetUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(budget?.monthlyLimit?.toString() || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const percentage = budget ? (spent / budget.monthlyLimit) * 100 : 0;
  const isOverBudget = percentage > 100;
  const remaining = budget ? Math.max(0, budget.monthlyLimit - spent) : 0;

  const handleSave = async () => {
    const newLimit = parseFloat(editValue);
    if (isNaN(newLimit) || newLimit <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsUpdating(true);
    try {
      if (budget) {
        await budgetService.update(budget.Id, { 
          ...budget, 
          monthlyLimit: newLimit 
        });
      } else {
        const currentMonth = format(new Date(), "yyyy-MM");
        await budgetService.create({
          categoryId: category.Id,
          monthlyLimit: newLimit,
          month: currentMonth,
          spent: 0
        });
      }
      
      toast.success("Budget updated successfully!");
      setIsEditing(false);
      onBudgetUpdated?.();
    } catch (error) {
      toast.error("Failed to update budget");
      console.error("Budget update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditValue(budget?.monthlyLimit?.toString() || "");
    setIsEditing(false);
  };

  const getProgressVariant = () => {
    if (percentage > 100) return "error";
    if (percentage > 80) return "warning";
    return "success";
  };

  return (
    <Card className={cn("transition-all duration-200", isOverBudget && "ring-2 ring-error-200")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <ApperIcon 
                name={category.icon} 
                className="w-6 h-6"
                style={{ color: category.color }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(), "MMMM yyyy")}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isUpdating}
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Budget
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {budget ? (
              <>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-gray-900">
                    ${spent.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    of ${budget.monthlyLimit.toFixed(2)}
                  </span>
                </div>
                
                <Progress 
                  value={spent} 
                  max={budget.monthlyLimit} 
                  variant={getProgressVariant()}
                  showPercentage 
                />
                
                <div className="flex justify-between text-sm">
                  <span className={cn(
                    "font-medium",
                    isOverBudget ? "text-error-600" : "text-success-600"
                  )}>
                    {isOverBudget 
                      ? `$${(spent - budget.monthlyLimit).toFixed(2)} over budget`
                      : `$${remaining.toFixed(2)} remaining`
                    }
                  </span>
                  <span className="text-gray-600">
                    {percentage.toFixed(1)}% used
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <ApperIcon name="Target" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">No budget set</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${spent.toFixed(2)} spent
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetCard;