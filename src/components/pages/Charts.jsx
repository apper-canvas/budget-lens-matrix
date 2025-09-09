import React, { useState } from "react";
import { useFinancialData } from "@/hooks/useFinancialData";
import SpendingChart from "@/components/organisms/SpendingChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const Charts = () => {
  const {
    transactions,
    categories,
    loading,
    error,
    refreshData
  } = useFinancialData();

  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  if (loading) return <Loading type="chart" />;
  if (error) return <Error message={error} onRetry={refreshData} />;

  if (transactions.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Charts</h1>
          <p className="text-gray-600">Visualize your spending patterns and trends</p>
        </div>

        <Empty
          icon="BarChart3"
          title="No data to visualize yet"
          message="Add some transactions to see beautiful charts and insights about your spending patterns. Charts help you understand where your money goes and identify trends."
          actionLabel="Add Transactions"
          onAction={() => window.location.href = "/transactions"}
        />
      </div>
    );
  }

  // Calculate insights for different periods
  const getInsightsForPeriod = (months) => {
    const now = new Date();
    const periodStart = subMonths(now, months);
    
    const periodTransactions = transactions.filter(t => 
      new Date(t.date) >= periodStart
    );

    const totalIncome = periodTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = periodTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const avgMonthlyIncome = totalIncome / months;
    const avgMonthlyExpenses = totalExpenses / months;

    const categoryTotals = {};
    periodTransactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    const topCategory = Object.keys(categoryTotals).length > 0 
      ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]
      : null;

    return {
      totalIncome,
      totalExpenses,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      topCategory,
      transactionCount: periodTransactions.length,
      netIncome: totalIncome - totalExpenses
    };
  };

  const currentInsights = getInsightsForPeriod(selectedPeriod === "3months" ? 3 : 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Charts</h1>
        <p className="text-gray-600">
          Analyze your spending patterns and financial trends
        </p>
      </div>

      {/* Period Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Monthly Income"
          value={`$${currentInsights.avgMonthlyIncome.toFixed(2)}`}
          icon="TrendingUp"
          gradient="success"
          change={`$${currentInsights.totalIncome.toFixed(2)} total`}
          changeType="positive"
        />
        <StatCard
          title="Average Monthly Expenses"
          value={`$${currentInsights.avgMonthlyExpenses.toFixed(2)}`}
          icon="TrendingDown"
          gradient="error"
          change={`$${currentInsights.totalExpenses.toFixed(2)} total`}
          changeType="neutral"
        />
        <StatCard
          title="Net Income"
          value={`$${currentInsights.netIncome.toFixed(2)}`}
          icon="DollarSign"
          gradient={currentInsights.netIncome >= 0 ? "success" : "error"}
          change={currentInsights.netIncome >= 0 ? "Positive flow" : "Deficit"}
          changeType={currentInsights.netIncome >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Top Category"
          value={currentInsights.topCategory ? currentInsights.topCategory[0] : "None"}
          icon="Target"
          gradient="warning"
          change={currentInsights.topCategory ? `$${currentInsights.topCategory[1].toFixed(2)}` : "No expenses"}
          changeType="neutral"
        />
      </div>

      {/* Main Chart */}
      <SpendingChart
        transactions={transactions}
        categories={categories}
      />

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="PieChart" className="w-5 h-5 text-primary-600" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories
              .map(category => {
                const categoryTransactions = transactions.filter(t => 
                  t.category === category.name && t.type === "expense"
                );
                const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                const percentage = currentInsights.totalExpenses > 0 
                  ? (total / currentInsights.totalExpenses) * 100 
                  : 0;
                
                return {
                  category,
                  total,
                  percentage,
                  transactionCount: categoryTransactions.length
                };
              })
              .filter(item => item.total > 0)
              .sort((a, b) => b.total - a.total)
              .map(item => (
                <div key={item.category.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.category.color }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{item.category.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.transactionCount} transaction{item.transactionCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${item.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Tips */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="TrendingUp" className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Income Trend</span>
            </div>
            <p className="text-sm text-primary-800">
              Your average monthly income is ${currentInsights.avgMonthlyIncome.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="PieChart" className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Spending Focus</span>
            </div>
            <p className="text-sm text-primary-800">
              {currentInsights.topCategory 
                ? `Most spending on ${currentInsights.topCategory[0]}`
                : "No major spending category identified"
              }
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Target" className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Savings Rate</span>
            </div>
            <p className="text-sm text-primary-800">
              {currentInsights.totalIncome > 0 
                ? `${((currentInsights.netIncome / currentInsights.totalIncome) * 100).toFixed(1)}% of income saved`
                : "Start tracking to calculate savings rate"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;