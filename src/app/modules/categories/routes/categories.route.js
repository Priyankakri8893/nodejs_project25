let express = require("express");
let router = express.Router();
const { wrapAsync } = require("../../../helpers/router.helper");
const { authenticate, roleAuth } = require("../../../middleware/jwt.middleware");

const {
  addCategories,
  getCategories,
} = require("../controllers/categories.controller");

router.post("/addCategories", authenticate, roleAuth, wrapAsync(addCategories));
router.get("/getCategories", authenticate, wrapAsync(getCategories));

module.exports = router;
