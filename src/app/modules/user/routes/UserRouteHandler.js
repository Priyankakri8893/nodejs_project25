const express = require('express');
const multer = require('multer');
const AuthMiddleware = require("../../../middleware/AuthMiddleware");
const { wrapAsync } = require("../../../helpers/AsyncWrapper");
const UserController = require('../controllers/UserController');

class UserRouteHandler {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
      },
    });

    const upload = multer({ storage: storage });

    this.router.post("/register", wrapAsync(UserController.register));
    this.router.post("/verifyOTP", wrapAsync(UserController.verifyOTP));
    this.router.post("/login", wrapAsync(UserController.login));
    this.router.get("/profile", AuthMiddleware.authenticate, wrapAsync(UserController.profile));
    this.router.patch("/editProfile", AuthMiddleware.authenticate, upload.single("file"), wrapAsync(UserController.editProfile));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new UserRouteHandler();
