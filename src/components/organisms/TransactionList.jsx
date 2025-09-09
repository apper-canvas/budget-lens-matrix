import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const TransactionList = ({ transactions, onTransactionDeleted, categories, loading }) => {
  const [filter, setFilter] = useState({
    category: "",
    type: "",
    search: ""
  });

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(id);
        toast.success("Transaction deleted successfully!");
        onTransactionDeleted?.();
      } catch (error) {
        toast.error("Failed to delete transaction");
        console.error("Delete error:", error);
      }
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = !filter.category || transaction.category === filter.category;
    const matchesType = !filter.type || transaction.type === filter.type;
    const matchesSearch = !filter.search || 
      transaction.description?.toLowerCase().includes(filter.search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(filter.search.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.icon || "Tag";
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || "#64748b";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="List" className="w-5 h-5 text-primary-600" />
          Recent Transactions
        </CardTitle>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Input
            placeholder="Search transactions..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Receipt" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-4">
              {filter.search || filter.category || filter.type 
                ? "Try adjusting your filters" 
                : "Start by adding your first transaction"}
            </p>
            {(filter.search || filter.category || filter.type) && (
              <Button 
                variant="outline" 
                onClick={() => setFilter({ category: "", type: "", search: "" })}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.Id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${getCategoryColor(transaction.category)}20` }}
                  >
                    <ApperIcon 
                      name={getCategoryIcon(transaction.category)} 
                      className="w-5 h-5"
                      style={{ color: getCategoryColor(transaction.category) }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">
                        {transaction.description || transaction.category}
                      </p>
                      <Badge variant={transaction.type === "income" ? "success" : "error"}>
                        {transaction.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-lg font-semibold",
                    transaction.type === "income" ? "text-success-600" : "text-error-600"
                  )}>
                    {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTransaction(transaction.Id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-error-600 hover:text-error-700 hover:bg-error-50"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;