let express = require("express");
let router = express.Router();
const { wrapAsync } = require("../../../helpers/router.helper");
const { authenticate, roleAuth } = require("../../../middleware/jwt.middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

const {
  addQuestion, questionList, uploadQuestions
} = require("../controllers/question.controller");

router.post("/addQuestion", authenticate, roleAuth, wrapAsync(addQuestion));
router.get("/questionList", authenticate, wrapAsync(questionList));
router.post("/uploadQuestions", authenticate, roleAuth, upload.single("file"), wrapAsync(uploadQuestions));

module.exports = router;
