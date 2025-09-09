import React from "react";
import { useFinancialData } from "@/hooks/useFinancialData";
import StatCard from "@/components/molecules/StatCard";
import SpendingChart from "@/components/organisms/SpendingChart";
import TransactionList from "@/components/organisms/TransactionList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { format } from "date-fns";

const Dashboard = () => {
  const {
    transactions,
    categories,
    loading,
    error,
    refreshData,
    getMonthlyStats,
    getBudgetProgress
  } = useFinancialData();

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={refreshData} />;

  const currentMonth = format(new Date(), "yyyy-MM");
  const stats = getMonthlyStats(currentMonth);
  const budgetProgress = getBudgetProgress(currentMonth);
  const recentTransactions = transactions.slice(0, 10);
  
  // Calculate total budget and spending
  const totalBudget = budgetProgress.reduce((sum, item) => sum + (item.budget?.monthlyLimit || 0), 0);
  const totalBudgetUsed = budgetProgress.reduce((sum, item) => sum + item.spent, 0);
  const budgetUtilization = totalBudget > 0 ? (totalBudgetUsed / totalBudget) * 100 : 0;

  // Calculate savings rate
  const savingsRate = stats.totalIncome > 0 ? ((stats.netIncome / stats.totalIncome) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
        <p className="text-gray-600">
          Overview for {format(new Date(), "MMMM yyyy")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={`$${stats.totalIncome.toFixed(2)}`}
          icon="TrendingUp"
          gradient="success"
          change={stats.totalIncome > 0 ? `${stats.transactionCount} transactions` : "No income yet"}
          changeType="positive"
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toFixed(2)}`}
          icon="TrendingDown"
          gradient="error"
          change={budgetUtilization > 0 ? `${budgetUtilization.toFixed(1)}% of budget` : "No budget set"}
          changeType={budgetUtilization > 100 ? "negative" : "neutral"}
        />
        <StatCard
          title="Net Income"
          value={`$${stats.netIncome.toFixed(2)}`}
          icon="DollarSign"
          gradient={stats.netIncome >= 0 ? "success" : "error"}
          change={savingsRate >= 0 ? `${savingsRate.toFixed(1)}% savings rate` : `${Math.abs(savingsRate).toFixed(1)}% deficit`}
          changeType={stats.netIncome >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Budget Remaining"
          value={`$${Math.max(0, totalBudget - totalBudgetUsed).toFixed(2)}`}
          icon="Target"
          gradient="primary"
          change={totalBudget > 0 ? `of $${totalBudget.toFixed(2)} budgeted` : "Set budgets to track"}
          changeType="neutral"
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Chart */}
        <div>
          <SpendingChart
            transactions={transactions}
            categories={categories}
          />
        </div>

        {/* Recent Transactions */}
        <div>
          <TransactionList
            transactions={recentTransactions}
            categories={categories}
            onTransactionDeleted={refreshData}
            loading={loading}
          />
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Top Category</span>
            </div>
            <p className="text-primary-900 font-semibold">
              {Object.keys(stats.categorySpending).length > 0 
                ? Object.entries(stats.categorySpending).sort((a, b) => b[1] - a[1])[0][0]
                : "No expenses yet"}
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Budget Status</span>
            </div>
            <p className="text-primary-900 font-semibold">
              {budgetProgress.filter(b => b.isOverBudget).length > 0
                ? `${budgetProgress.filter(b => b.isOverBudget).length} over budget`
                : "All budgets on track"}
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Transactions</span>
            </div>
            <p className="text-primary-900 font-semibold">
              {stats.transactionCount} this month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;