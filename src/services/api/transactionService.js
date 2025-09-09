import transactionsData from "@/services/mockData/transactions.json";
class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await this.delay();
    const transaction = this.transactions.find(t => t.Id === parseInt(id));
    return transaction ? { ...transaction } : null;
  }

  async create(transactionData) {
    await this.delay();
    const maxId = Math.max(...this.transactions.map(t => t.Id), 0);
    const newTransaction = {
      ...transactionData,
      Id: maxId + 1,
      createdAt: new Date()
    };
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await this.delay();
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      this.transactions[index] = { ...transactionData, Id: parseInt(id) };
      return { ...this.transactions[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.transactions.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async getByCategory(category) {
    await this.delay();
    return this.transactions
      .filter(t => t.category === category)
      .map(t => ({ ...t }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      })
      .map(t => ({ ...t }))
.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Export all transactions as CSV
  async exportTransactionsCSV() {
    await this.delay();
    const { csvExportService } = await import('./csvExportService.js');
    
    try {
      const transactions = await this.getAll();
      const csvContent = csvExportService.generateTransactionCSV(transactions);
      const filename = `transactions-export-${new Date().toISOString().split('T')[0]}.csv`;
      
      csvExportService.downloadCSV(csvContent, filename);
      return { success: true, message: 'Transactions exported successfully' };
    } catch (error) {
      throw new Error('Failed to export transactions: ' + error.message);
    }
  }

  // Export financial summary report as CSV
  async exportSummaryReportCSV() {
    await this.delay();
    const { csvExportService } = await import('./csvExportService.js');
    
    try {
      const transactions = await this.getAll();
      const csvContent = csvExportService.generateSummaryReportCSV(transactions);
      const filename = `financial-summary-${new Date().toISOString().split('T')[0]}.csv`;
      
      csvExportService.downloadCSV(csvContent, filename);
      return { success: true, message: 'Financial summary exported successfully' };
    } catch (error) {
      throw new Error('Failed to export summary report: ' + error.message);
    }
  }
}

export const transactionService = new TransactionService();