import React, { useState } from "react";
import { toast } from "react-toastify";
import { useFinancialData } from "@/hooks/useFinancialData";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { transactionService } from '@/services/api/transactionService';
import Error from "@/components/ui/Error";
import { categoryService } from "@/services/api/categoryService";

const Settings = () => {
  const { categories, loading, error, refreshData } = useFinancialData();
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#3b82f6",
    icon: "Tag",
    type: "expense"
  });
const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refreshData} />;

  const availableIcons = [
    "Tag", "ShoppingCart", "Car", "Home", "Zap", "Music", "UtensilsCrossed", 
    "Heart", "ShoppingBag", "Train", "BookOpen", "Briefcase", "Monitor", 
    "TrendingUp", "Gift", "MoreHorizontal", "CreditCard", "Smartphone",
    "Coffee", "Gamepad2", "Plane", "MapPin", "Camera", "Headphones"
  ];

  const availableColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899",
    "#f97316", "#06b6d4", "#84cc16", "#64748b", "#dc2626", "#059669",
    "#0ea5e9", "#7c3aed", "#db2777", "#65a30d"
  ];

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      toast.error("A category with this name already exists");
      return;
    }

    setIsAddingCategory(true);
    try {
      await categoryService.create(newCategory);
      toast.success("Category added successfully!");
      
      setNewCategory({
        name: "",
        color: "#3b82f6",
        icon: "Tag",
        type: "expense"
      });
      setShowAddForm(false);
      refreshData();
    } catch (error) {
      toast.error("Failed to add category");
      console.error("Category creation error:", error);
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        await categoryService.delete(categoryId);
        toast.success("Category deleted successfully!");
        refreshData();
      } catch (error) {
        toast.error("Failed to delete category");
        console.error("Category deletion error:", error);
      }
    }
  };

const expenseCategories = categories.filter(cat => cat.type === "expense" || cat.type === "both");
  const incomeCategories = categories.filter(cat => cat.type === "income" || cat.type === "both");

// Export functionality state (moved to top of component)

  // Handle transaction export
  const handleExportTransactions = async () => {
    setExportLoading(true);
    try {
      const result = await transactionService.exportTransactionsCSV();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setExportLoading(false);
    }
  };

  // Handle summary report export
  const handleExportSummaryReport = async () => {
    setExportLoading(true);
    try {
      const result = await transactionService.exportSummaryReportCSV();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your categories and preferences</p>
      </div>

      {/* Data Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Download" className="w-5 h-5 text-primary-600" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Export your financial data in CSV format for use in spreadsheet applications or backup purposes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Export */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ApperIcon name="Receipt" className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium text-gray-900">Transaction Export</h4>
              </div>
              <p className="text-sm text-gray-600">
                Export all your transactions with details including date, description, category, type, and amount.
              </p>
              <Button
                onClick={handleExportTransactions}
                disabled={exportLoading}
                className="w-full"
                variant="outline"
              >
                {exportLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <ApperIcon name="FileSpreadsheet" className="w-4 h-4 mr-2" />
                    Export Transactions
                  </>
                )}
              </Button>
            </div>

            {/* Summary Report Export */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ApperIcon name="BarChart3" className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium text-gray-900">Financial Summary</h4>
              </div>
              <p className="text-sm text-gray-600">
                Export a monthly financial summary with income, expenses, and net totals grouped by category.
              </p>
              <Button
                onClick={handleExportSummaryReport}
                disabled={exportLoading}
                className="w-full"
                variant="outline"
              >
                {exportLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="TrendingUp" className="w-4 h-4 mr-2" />
                    Export Summary Report
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Export Information</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</li>
                  <li>• Transaction exports include all recorded financial data</li>
                  <li>• Summary reports provide monthly insights grouped by category</li>
                  <li>• All currency amounts are formatted in USD</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Category */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Plus" className="w-5 h-5 text-primary-600" />
              Add New Category
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
            >
              <ApperIcon name={showAddForm ? "X" : "Plus"} className="w-4 h-4 mr-2" />
              {showAddForm ? "Cancel" : "Add Category"}
            </Button>
          </div>
        </CardHeader>
        
        {showAddForm && (
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Category Name" required>
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name..."
                    maxLength={50}
                  />
                </FormField>

                <FormField label="Category Type" required>
                  <Select
                    value={newCategory.type}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="both">Both</option>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Icon">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${newCategory.color}20` }}
                      >
                        <ApperIcon 
                          name={newCategory.icon} 
                          className="w-5 h-5"
                          style={{ color: newCategory.color }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">Preview</span>
                    </div>
                    <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                      {availableIcons.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                          className={`p-2 rounded-lg border transition-all ${
                            newCategory.icon === icon 
                              ? "border-primary-500 bg-primary-50" 
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <ApperIcon name={icon} className="w-4 h-4 text-gray-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                </FormField>

                <FormField label="Color">
                  <div className="space-y-3">
                    <Input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                      className="h-12"
                    />
                    <div className="grid grid-cols-8 gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            newCategory.color === color 
                              ? "border-gray-800 scale-110" 
                              : "border-gray-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </FormField>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isAddingCategory || !newCategory.name.trim()}
                >
                  {isAddingCategory ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                      Add Category
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  disabled={isAddingCategory}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="TrendingDown" className="w-5 h-5 text-error-600" />
            Expense Categories ({expenseCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map(category => (
              <div
                key={category.Id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <ApperIcon 
                      name={category.icon} 
                      className="w-5 h-5"
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{category.type}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.Id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-error-600 hover:text-error-700 hover:bg-error-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Income Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-success-600" />
            Income Categories ({incomeCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.map(category => (
              <div
                key={category.Id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <ApperIcon 
                      name={category.icon} 
                      className="w-5 h-5"
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{category.type}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.Id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-error-600 hover:text-error-700 hover:bg-error-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Info" className="w-5 h-5 text-primary-600" />
            About Budget Lens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Track income and expenses</li>
                  <li>• Set and monitor budgets</li>
                  <li>• Visualize spending patterns</li>
                  <li>• Categorize transactions</li>
                  <li>• Real-time calculations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Data Storage</h4>
                <p className="text-sm text-gray-600">
                  All your financial data is stored locally in your browser. 
                  No personal information is sent to external servers, ensuring 
                  your privacy and security.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Budget Lens v1.0 - Personal Finance Tracker
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;