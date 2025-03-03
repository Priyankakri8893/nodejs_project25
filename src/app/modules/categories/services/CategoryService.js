const { msg } = require("../../../../config/message");
const Validator = require("../../../middleware/Validator");
const { CategoryModel } = require("../models/CategoryModel");

class CategoryService {
    constructor() {
        this.CategoryModel = new CategoryModel();
    }
    async addCategories(body) {
        if (!body?.categories?.length) throw "categories is empty";
        const categories = await this.CategoryModel.insertMany(body.categories);
        return {
            msg: msg.success,
        };
    }

    async getCategories(query) {
        let pipeline = [];

        if (Validator.isValid(query.key)) {
            pipeline.push({ $match: { name: { $regex: query.key, $options: "i" } } });
        } else {
            pipeline.push({ $match: {} });
        }

        if (Validator.isValid(query.page) && query.page > 0) {
            pipeline.push({ $skip: (query.page - 1) * 10 }, { $limit: 10 });
        }

        const categories = await this.CategoryModel.aggregate(pipeline);
        return {
            msg: msg.success,
            count: categories.length,
            result: categories,
        };
    }

    async findCategories(query) {
        const categories = await this.CategoryModel.findAll(query);
        return categories
    }
}

module.exports = new CategoryService();
