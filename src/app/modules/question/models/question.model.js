const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
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

const Question = mongoose.model("Question", QuestionSchema);
module.exports = { Question };
