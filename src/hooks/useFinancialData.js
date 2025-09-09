import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { budgetService } from "@/services/api/budgetService";
import { format } from "date-fns";

export const useFinancialData = () => {
  const [data, setData] = useState({
    transactions: [],
    categories: [],
    budgets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      const [transactions, categories, budgets] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll(),
        budgetService.getAll()
      ]);

      setData({
        transactions,
        categories,
        budgets
      });
    } catch (err) {
      setError("Failed to load financial data. Please try again.");
      console.error("Data loading error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = () => {
    loadData();
  };

  const getMonthlyStats = (month = format(new Date(), "yyyy-MM")) => {
    const monthlyTransactions = data.transactions.filter(t => 
      format(new Date(t.date), "yyyy-MM") === month
    );

    const totalIncome = monthlyTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalIncome - totalExpenses;

    const categorySpending = {};
    monthlyTransactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      categorySpending,
      transactionCount: monthlyTransactions.length
    };
  };

  const getBudgetProgress = (month = format(new Date(), "yyyy-MM")) => {
    const stats = getMonthlyStats(month);
    const monthlyBudgets = data.budgets.filter(b => b.month === month);
    
    return data.categories.map(category => {
      const budget = monthlyBudgets.find(b => b.categoryId === category.Id);
      const spent = stats.categorySpending[category.name] || 0;
      
      return {
        category,
        budget,
        spent,
        remaining: budget ? Math.max(0, budget.monthlyLimit - spent) : 0,
        percentage: budget ? (spent / budget.monthlyLimit) * 100 : 0,
        isOverBudget: budget ? spent > budget.monthlyLimit : false
      };
    }).filter(item => item.budget || item.spent > 0);
  };

  return {
    ...data,
    loading,
    error,
    refreshData,
    getMonthlyStats,
    getBudgetProgress
  };
};