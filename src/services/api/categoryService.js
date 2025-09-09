import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.categories];
  }

  async getById(id) {
    await this.delay();
    const category = this.categories.find(c => c.Id === parseInt(id));
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await this.delay();
    const maxId = Math.max(...this.categories.map(c => c.Id), 0);
    const newCategory = {
      ...categoryData,
      Id: maxId + 1
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      this.categories[index] = { ...categoryData, Id: parseInt(id) };
      return { ...this.categories[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.categories.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async getByType(type) {
    await this.delay();
    return this.categories
      .filter(c => c.type === type || c.type === "both")
      .map(c => ({ ...c }));
  }
}

export const categoryService = new CategoryService();