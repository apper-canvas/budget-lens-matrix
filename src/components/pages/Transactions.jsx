import React, { useState } from "react";
import { useFinancialData } from "@/hooks/useFinancialData";
import TransactionForm from "@/components/organisms/TransactionForm";
import TransactionList from "@/components/organisms/TransactionList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Transactions = () => {
  const {
    transactions,
    categories,
    loading,
    error,
    refreshData
  } = useFinancialData();

  const [showForm, setShowForm] = useState(false);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refreshData} />;

  const handleTransactionAdded = () => {
    refreshData();
    setShowForm(false);
  };

  if (transactions.length === 0 && !showForm) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
            <p className="text-gray-600">Track your income and expenses</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <Empty
          icon="Receipt"
          title="No transactions yet"
          message="Start tracking your finances by adding your first income or expense transaction. Every transaction helps you understand your spending patterns better."
          actionLabel="Add Your First Transaction"
          onAction={() => setShowForm(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-600">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <ApperIcon name={showForm ? "X" : "Plus"} className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add Transaction"}
        </Button>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <TransactionForm
          categories={categories}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        categories={categories}
        onTransactionDeleted={refreshData}
        loading={loading}
      />
    </div>
  );
};

export default Transactions;