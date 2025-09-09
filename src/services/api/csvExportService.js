// CSV Export Service - Utilities for generating and downloading CSV files
class CsvExportService {
  // Convert array of objects to CSV format
  convertToCSV(data, headers) {
    if (!data || data.length === 0) {
      return '';
    }

    // Create header row
    const headerRow = headers.map(header => `"${header}"`).join(',');
    
    // Create data rows
    const dataRows = data.map(item => {
      return headers.map(header => {
        const value = this.getNestedValue(item, header);
        // Handle different data types and escape quotes
        if (value === null || value === undefined) {
          return '""';
        }
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
  }

  // Get nested object values (e.g., 'category.name')
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  // Format currency values for CSV
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Format date for CSV export
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  }

  // Download CSV file
  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Generate transaction CSV with proper formatting
  generateTransactionCSV(transactions) {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    
    const formattedTransactions = transactions.map(transaction => ({
      Date: this.formatDate(transaction.date),
      Description: transaction.description,
      Category: transaction.category,
      Type: transaction.type,
      Amount: this.formatCurrency(transaction.amount)
    }));

    return this.convertToCSV(formattedTransactions, headers);
  }

  // Generate summary report CSV
  generateSummaryReportCSV(transactions) {
    // Group transactions by month and category
    const monthlyData = this.groupTransactionsByMonth(transactions);
    const summaryData = [];

    Object.keys(monthlyData).forEach(month => {
      const monthData = monthlyData[month];
      const categoryTotals = {};
      let totalIncome = 0;
      let totalExpenses = 0;

      monthData.forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = { income: 0, expense: 0 };
        }

        if (transaction.type === 'income') {
          categoryTotals[transaction.category].income += transaction.amount;
          totalIncome += transaction.amount;
        } else {
          categoryTotals[transaction.category].expense += transaction.amount;
          totalExpenses += transaction.amount;
        }
      });

      // Add summary row for the month
      summaryData.push({
        Month: month,
        Category: 'TOTAL',
        Income: this.formatCurrency(totalIncome),
        Expenses: this.formatCurrency(totalExpenses),
        'Net Income': this.formatCurrency(totalIncome - totalExpenses)
      });

      // Add category breakdown
      Object.keys(categoryTotals).forEach(category => {
        const catData = categoryTotals[category];
        if (catData.income > 0 || catData.expense > 0) {
          summaryData.push({
            Month: month,
            Category: category,
            Income: this.formatCurrency(catData.income),
            Expenses: this.formatCurrency(catData.expense),
            'Net Income': this.formatCurrency(catData.income - catData.expense)
          });
        }
      });
    });

    const headers = ['Month', 'Category', 'Income', 'Expenses', 'Net Income'];
    return this.convertToCSV(summaryData, headers);
  }

  // Group transactions by month for summary reports
  groupTransactionsByMonth(transactions) {
    const grouped = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(transaction);
    });

    return grouped;
  }
}

export const csvExportService = new CsvExportService();