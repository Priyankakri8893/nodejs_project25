const mongoose = require("mongoose");

class CategoryModel {
  constructor() {
    this.CategorySchema = new mongoose.Schema(
      {
        name: { type: String, trim: true, required: true, unique: true },
      },
      { timestamps: true }
    );

    this.Category = mongoose.model("Category", this.CategorySchema);
  }

  async save(categoryData) {
    const newCategory = new this.Category(categoryData);
    return await newCategory.save();
  }

  async findOne(query) {
    return await this.Category.findOne(query);
  }

  async aggregate(pipeline) {
    return await this.Category.aggregate(pipeline);
  }

  async insertMany(categories) {
    return await this.Category.insertMany(categories);
  }

  async findById(id) {
    return await this.Category.findById(id);
  }

  async findAll(query) {
    return await this.Category.find(query);
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    return await this.Category.findByIdAndUpdate(id, updateData, options);
  }

  async deleteById(id) {
    return await this.Category.findByIdAndDelete(id);
  }
}

module.exports = { CategoryModel };
