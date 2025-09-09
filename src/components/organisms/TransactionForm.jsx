import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { format } from "date-fns";

const TransactionForm = ({ onTransactionAdded, categories }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: format(new Date(), "yyyy-MM-dd"),
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const transaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        createdAt: new Date()
      };

      await transactionService.create(transaction);
      
      setFormData({
        amount: "",
        category: "",
        type: "expense",
        date: format(new Date(), "yyyy-MM-dd"),
        description: ""
      });

      toast.success("Transaction added successfully!");
      onTransactionAdded?.();
    } catch (error) {
      toast.error("Failed to add transaction");
      console.error("Transaction creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: "income", label: "Income", icon: "TrendingUp", color: "text-success-600" },
    { value: "expense", label: "Expense", icon: "TrendingDown", color: "text-error-600" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="Plus" className="w-5 h-5 text-primary-600" />
          Add New Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Transaction Type" error={errors.type}>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                error={!!errors.type}
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Amount" required error={errors.amount}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-8"
                  error={!!errors.amount}
                />
              </div>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Category" required error={errors.category}>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                error={!!errors.category}
              >
                <option value="">Select a category</option>
                {categories
                  .filter(cat => cat.type === "both" || cat.type === formData.type)
                  .map(category => (
                    <option key={category.Id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </Select>
            </FormField>

            <FormField label="Date" required error={errors.date}>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                max={format(new Date(), "yyyy-MM-dd")}
                error={!!errors.date}
              />
            </FormField>
          </div>

          <FormField label="Description" error={errors.description}>
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description..."
            />
          </FormField>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Transaction
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;