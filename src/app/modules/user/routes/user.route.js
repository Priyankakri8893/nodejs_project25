let express = require('express');
let router = express.Router();
const { wrapAsync } = require("../../../helpers/router.helper");
const { authenticate } = require("../../../middleware/jwt.middleware")
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
  },
});

const upload = multer({ storage: storage });
const {
  register,
  verifyOTP,
  login,
  profile,
  editProfile,
} = require('../controllers/user.controller')

router.post("/register", wrapAsync(register));
router.post("/verifyOTP", wrapAsync(verifyOTP));
router.post("/login", wrapAsync(login));
router.get("/profile", authenticate, wrapAsync(profile));
router.put("/editProfile", authenticate, upload.single("file"), wrapAsync(editProfile));

module.exports = router;