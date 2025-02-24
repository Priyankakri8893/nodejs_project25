const {
  addQuestion, questionList, uploadQuestions
} = require("../bussiness/question.bussiness");

exports.addQuestion = async (req) => await addQuestion(req.user, req.body);
exports.questionList = async (req) => await questionList(req.query);
exports.uploadQuestions = async (req) => await uploadQuestions(req.file);
