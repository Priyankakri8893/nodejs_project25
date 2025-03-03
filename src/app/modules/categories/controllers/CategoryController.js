const CategoryService = require("../services/CategoryService");

class CategoryController {
  static async addCategories(req) {
    return await CategoryService.addCategories(req.body);
  }

  static async getCategories(req) {
    return await CategoryService.getCategories(req.query);
  }
}

module.exports = CategoryController;
