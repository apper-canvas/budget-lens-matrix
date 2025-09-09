import savingsGoalsData from "@/services/mockData/savingsGoals.json";

class SavingsGoalService {
  constructor() {
    this.savingsGoals = [...savingsGoalsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.savingsGoals];
  }

  async getById(id) {
    await this.delay();
    const goal = this.savingsGoals.find(g => g.Id === parseInt(id));
    return goal ? { ...goal } : null;
  }

  async create(goalData) {
    await this.delay();
    const maxId = Math.max(...this.savingsGoals.map(g => g.Id), 0);
    const newGoal = {
      ...goalData,
      Id: maxId + 1
    };
    this.savingsGoals.push(newGoal);
    return { ...newGoal };
  }

  async update(id, goalData) {
    await this.delay();
    const index = this.savingsGoals.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      this.savingsGoals[index] = { ...goalData, Id: parseInt(id) };
      return { ...this.savingsGoals[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.savingsGoals.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.savingsGoals.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
}

export const savingsGoalService = new SavingsGoalService();