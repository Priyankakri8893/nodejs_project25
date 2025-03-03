const mongoose = require("mongoose");

class QuestionModel {
  constructor() {
    this.QuestionSchema = new mongoose.Schema(
      {
        question: { type: String, trim: true, required: true },
        type: {
          type: String,
          enum: ["multiple-choice", "short-answer", "essay"],
          default: "short-answer",
          trim: true,
        },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        options: [String],
        correctAnswer: { type: String, trim: true },
      },
      { timestamps: true }
    );

    this.Question = mongoose.model("Question", this.QuestionSchema);
  }

  async save(questionData) {
    const newQuestion = new this.Question(questionData);
    return await newQuestion.save();
  }

  async findOne(query) {
    return await this.Question.findOne(query);
  }

  async aggregate(pipeline) {
    return await this.Question.aggregate(pipeline);
  }

  async insertMany(questions) {
    return await this.Question.insertMany(questions);
  }

  async findById(id) {
    return await this.Question.findById(id);
  }

  async bulkWrite(bulkOperations) {
    return await this.Question.bulkWrite(bulkOperations, { ordered: false });
  }

  async findAll() {
    return await this.Question.find();
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    return await this.Question.findByIdAndUpdate(id, updateData, options);
  }

  async deleteById(id) {
    return await this.Question.findByIdAndDelete(id);
  }
}

module.exports = { QuestionModel };
