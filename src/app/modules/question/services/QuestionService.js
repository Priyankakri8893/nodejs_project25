const mongoose = require("mongoose");
const { msg } = require("../../../../config/message");
const Validator = require("../../../middleware/Validator");
const { QuestionModel } = require("../models/QuestionModel");
const CategoryService = require("../../categories/services/CategoryService");
const csvToJson = require("csv-file-to-json");
const fs = require("fs").promises;

class QuestionService {
  constructor() {
    this.QuestionModel = new QuestionModel();
  }

  async addQuestion(user, body) {
    if (!body?.questionList?.length) throw "questionList is empty";
    await this.QuestionModel.insertMany(body.questionList);
    return {
      msg: msg.success,
    };
  }

  async questionList(query) {
    let pipeline = [];

    if (Validator.isValid(query.key)) {
      pipeline.push({ $match: { question: { $regex: query.key, $options: "i" } } });
    }
    if (Validator.isValid(query.type)) {
      pipeline.push({ $match: { type: query.type } });
    }

    pipeline.push({ $unwind: "$categories" });
    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categoryData",
      },
    });
    pipeline.push({ $unwind: "$categoryData" });
    pipeline.push({ $addFields: { categoryName: "$categoryData.name" } });
    pipeline.push({ $project: { categoryData: 0 } });

    if (Validator.isValid(query.categorieId)) {
      pipeline.push({ $match: { categories: new mongoose.Types.ObjectId(query.categorieId) } });
    }
    if (Validator.isValid(query.categoryWiseGroup) && query.categoryWiseGroup == "true") {
      pipeline.push({
        $group: {
          _id: "$categories",
          count: { $sum: 1 },
          questionList: { $push: "$$ROOT" },
        },
      });
    }

    if (Validator.isValid(query.page) && query.page > 0) {
      pipeline.push({ $skip: (query.page - 1) * 10 }, { $limit: 10 });
    }

    const questionList = await this.QuestionModel.aggregate(pipeline);
    return {
      msg: msg.success,
      count: questionList.length,
      result: questionList,
    };
  }

  async uploadQuestions(file) {
    try {
      if (!file) throw new Error("No file provided");

      const questionsArray = await csvToJson({ filePath: file.path });

      if (!questionsArray.length) throw new Error("CSV file is empty");

      const allCategories = [
        ...new Set(questionsArray.flatMap((row) => (row.categories ? row.categories.split(",") : []))),
      ];

      const categoryData = await CategoryService.findCategories({ name: { $in: allCategories } })
      const categoryMap = categoryData.reduce((acc, category) => {
        acc[category.name] = category._id;
        return acc;
      }, {});

      const chunkSize = 200;
      for (let i = 0; i < questionsArray.length; i += chunkSize) {
        const chunk = questionsArray.slice(i, i + chunkSize);
        const bulkOperations = chunk
          .filter((row) => row.question)
          .map((row) => ({
            updateOne: {
              filter: { question: row.question },
              update: {
                $set: {
                  question: row.question,
                  type: row.type,
                  categories: (row.categories ? row.categories.split(",") : [])
                    .map((cat) => categoryMap[cat])
                    .filter(Boolean),
                  options: row.options ? row.options.split(",") : [],
                  correctAnswer: row.correctAnswer || "",
                },
              },
              upsert: true,
            },
          }));

        if (bulkOperations.length) {
          await this.QuestionModel.bulkWrite(bulkOperations);
        }
      }

      await fs.unlink(file.path);
      return { msg: "Questions uploaded successfully" };
    } catch (error) {
      console.error("Error uploading questions:", error.message);
      throw new Error(error.message);
    }
  }
}

module.exports = new QuestionService();
