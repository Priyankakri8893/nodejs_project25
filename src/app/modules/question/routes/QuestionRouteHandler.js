const express = require("express");
const AuthMiddleware = require("../../../middleware/AuthMiddleware");
const { wrapAsync } = require("../../../helpers/AsyncWrapper");
const QuestionController = require('../controllers/QuestionController');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Only .csv files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter, 
});

class QuestionRouteHandler {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/addQuestion", AuthMiddleware.authenticate, AuthMiddleware.roleAuth, wrapAsync(QuestionController.addQuestion));
    this.router.get("/questionList", AuthMiddleware.authenticate, wrapAsync(QuestionController.questionList));
    this.router.post("/uploadQuestions", AuthMiddleware.authenticate, AuthMiddleware.roleAuth, upload.single("file"), wrapAsync(QuestionController.uploadQuestions));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new QuestionRouteHandler();
