import React from "react";
import { useFinancialData } from "@/hooks/useFinancialData";
import BudgetCard from "@/components/organisms/BudgetCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatCard from "@/components/molecules/StatCard";
import { format } from "date-fns";

const Budgets = () => {
  const {
    categories,
    loading,
    error,
    refreshData,
    getBudgetProgress,
    getMonthlyStats
  } = useFinancialData();

  if (loading) return <Loading type="budgets" />;
  if (error) return <Error message={error} onRetry={refreshData} />;

  const currentMonth = format(new Date(), "yyyy-MM");
  const budgetProgress = getBudgetProgress(currentMonth);
  const stats = getMonthlyStats(currentMonth);

  // Calculate budget summary
  const totalBudget = budgetProgress.reduce((sum, item) => sum + (item.budget?.monthlyLimit || 0), 0);
  const totalSpent = budgetProgress.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const overBudgetCategories = budgetProgress.filter(item => item.isOverBudget).length;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (budgetProgress.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Management</h1>
          <p className="text-gray-600">Set and track spending limits for each category</p>
        </div>

        <Empty
          icon="Target"
          title="No budgets set up yet"
          message="Create budgets for your spending categories to track your financial goals and stay within your limits. Budgets help you control spending and achieve financial discipline."
          actionLabel="Set Up Your First Budget"
          onAction={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Management</h1>
        <p className="text-gray-600">
          Budget overview for {format(new Date(), "MMMM yyyy")}
        </p>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Budget"
          value={`$${totalBudget.toFixed(2)}`}
          icon="Target"
          gradient="primary"
          change={`${budgetProgress.length} categories`}
          changeType="neutral"
        />
        <StatCard
          title="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          icon="TrendingDown"
          gradient="error"
          change={`${budgetUtilization.toFixed(1)}% of budget`}
          changeType={budgetUtilization > 100 ? "negative" : "neutral"}
        />
        <StatCard
          title="Remaining Budget"
          value={`$${totalRemaining.toFixed(2)}`}
          icon="DollarSign"
          gradient="success"
          change={totalBudget > totalSpent ? "Under budget" : "Over budget"}
          changeType={totalBudget > totalSpent ? "positive" : "negative"}
        />
        <StatCard
          title="Categories Over Budget"
          value={overBudgetCategories}
          icon="AlertTriangle"
          gradient={overBudgetCategories > 0 ? "warning" : "success"}
          change={overBudgetCategories === 0 ? "All on track" : "Need attention"}
          changeType={overBudgetCategories === 0 ? "positive" : "negative"}
        />
      </div>

      {/* Budget Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Category Budgets</h2>
          <div className="text-sm text-gray-600">
            Click the edit button on any card to set or update budgets
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetProgress.map((item) => (
            <BudgetCard
              key={item.category.Id}
              budget={item.budget}
              category={item.category}
              spent={item.spent}
              onBudgetUpdated={refreshData}
            />
          ))}
        </div>
      </div>

      {/* Budget Tips */}
      <div className="bg-gradient-to-r from-success-50 to-success-100 rounded-xl p-6 border border-success-200">
        <h3 className="text-lg font-semibold text-success-900 mb-4">Budget Management Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">50/30/20 Rule</span>
            </div>
            <p className="text-sm text-success-800">
              Allocate 50% for needs, 30% for wants, 20% for savings and debt payment
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Track Regularly</span>
            </div>
            <p className="text-sm text-success-800">
              Review your spending weekly to stay on track with your budget goals
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Adjust as Needed</span>
            </div>
            <p className="text-sm text-success-800">
              Life changes, so should your budget. Review and adjust monthly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;