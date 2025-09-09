import budgetsData from "@/services/mockData/budgets.json";

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.budgets];
  }

  async getById(id) {
    await this.delay();
    const budget = this.budgets.find(b => b.Id === parseInt(id));
    return budget ? { ...budget } : null;
  }

  async create(budgetData) {
    await this.delay();
    const maxId = Math.max(...this.budgets.map(b => b.Id), 0);
    const newBudget = {
      ...budgetData,
      Id: maxId + 1
    };
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, budgetData) {
    await this.delay();
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      this.budgets[index] = { ...budgetData, Id: parseInt(id) };
      return { ...this.budgets[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.budgets.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async getByMonth(month) {
    await this.delay();
    return this.budgets
      .filter(b => b.month === month)
      .map(b => ({ ...b }));
  }

  async getByCategoryId(categoryId) {
    await this.delay();
    const budget = this.budgets.find(b => b.categoryId === parseInt(categoryId));
    return budget ? { ...budget } : null;
  }
}

export const budgetService = new BudgetService();