const mongoose = require("mongoose");
const { msg } = require("../../../../config/message");
const { isValid } = require("../../../middleware/validator.middleware");
const { Question } = require("../models/question.model");
const { Category } = require("../../categories/models/categories.model");
const csvToJson = require("csv-file-to-json");

const addQuestion = async (user, body) => {
  if (!body?.questionList?.length) throw "questionList is empty"
  await Question.insertMany(body.questionList);
  return {
    msg: msg.success,
  };
};

const questionList = async (query) => {
  let pipeline = []
  if (isValid(query.key)) {
    pipeline.push({ $match: { question: { $regex: query.key, $options: "i" } } });
  }
  if (isValid(query.type)) {
    pipeline.push({ $match: { type: query.type } });
  }
  pipeline.push({ $unwind: '$categories' })
  pipeline.push({
    $lookup: {
      from: "categories",
      localField: "categories",
      foreignField: "_id",
      as: "categoryData",
    },
  })
  pipeline.push({ $unwind: '$categoryData' })
  pipeline.push({ $addFields: { categoryName: '$categoryData.name' } })
  pipeline.push({ $project: { categoryData: 0 } })
  if (isValid(query.categorieId)) {
    pipeline.push({ $match: { 'categories': new mongoose.Types.ObjectId(query.categorieId) } })
  }
  if (isValid(query.categoryWiseGroup) && query.categoryWiseGroup == 'true') {
    pipeline.push({
      $group: {
        _id: "$categories",
        count: { $sum: 1 },
        questionList: { $push: "$$ROOT" }
      }
    })
  }

  if (isValid(query.page) && query.page > 0) {
    pipeline.push({ $skip: (query.page - 1) * 10 }, { $limit: 10 });
  }
  const questionList = await Question.aggregate(pipeline);
  return {
    msg: msg.success,
    count: questionList.length,
    result: questionList,
  };
};

const uploadQuestions = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    // Convert CSV to JSON
    const questionsArray = await csvToJson({ filePath: file.path });

    if (!questionsArray.length) throw new Error("CSV file is empty");

    for (const row of questionsArray) {
      const { question, type, categories, options, correctAnswer } = row;

      if (!question) {
        console.error("Skipping row: Question is required");
        continue;
      }

      const categoryDocs = await Category.find({ name: { $in: categories.split(",") } }).select("_id");

      const newQuestion = new Question({
        question,
        type,
        categories: categoryDocs.map((cat) => cat._id),
        options: options ? options.split(",") : [],
        correctAnswer: correctAnswer || "",
      });

      await newQuestion.save();
    }

    return { msg: "Questions uploaded successfully" };
  } catch (error) {
    console.error("Error uploading questions:", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  addQuestion, questionList, uploadQuestions
};
