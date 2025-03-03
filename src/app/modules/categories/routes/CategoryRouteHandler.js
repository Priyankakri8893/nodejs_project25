const express = require("express");
const AuthMiddleware = require("../../../middleware/AuthMiddleware");
const { wrapAsync } = require("../../../helpers/AsyncWrapper");
const CategoryController = require("../controllers/CategoryController");

class CategoryRouteHandler {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/addCategories", AuthMiddleware.authenticate, AuthMiddleware.roleAuth, wrapAsync(CategoryController.addCategories));
    this.router.get("/getCategories", AuthMiddleware.authenticate, wrapAsync(CategoryController.getCategories));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new CategoryRouteHandler();
