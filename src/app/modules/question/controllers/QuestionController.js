const QuestionService = require("../services/QuestionService");

class QuestionController {
  static async addQuestion(req) {
    return await QuestionService.addQuestion(req.user, req.body);
  }

  static async questionList(req) {
    return await QuestionService.questionList(req.query);
  }

  static async uploadQuestions(req) {
    return await QuestionService.uploadQuestions(req.file);
  }
}

module.exports = QuestionController;
