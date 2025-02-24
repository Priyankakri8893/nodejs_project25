const {
  addCategories,
  getCategories,
} = require("../bussiness/categories.bussiness");

exports.addCategories = async (req) => await addCategories(req.body);
exports.getCategories = async (req) => await getCategories(req.query);