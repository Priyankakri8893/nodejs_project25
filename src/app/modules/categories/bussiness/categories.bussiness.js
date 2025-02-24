const { msg } = require("../../../../config/message");
const { isValid } = require("../../../middleware/validator.middleware");
const { Category } = require("../models/categories.model");

const addCategories = async (body) => {
  if (!body?.categories?.length) throw "categories is empty";
  const categories = await Category.insertMany(body.categories)
  return {
    msg: msg.success,
  };
};

const getCategories = async (query) => {
  let pipeline = []
  if (isValid(query.key)) {
    pipeline.push({ $match: { name: { $regex: query.key, $options: "i" } } });
  } else {
    pipeline.push({ $match: {} });
  }
  if (isValid(query.page) && query.page > 0) {
    pipeline.push({ $skip: (query.page - 1) * 10 }, { $limit: 10 });
  }
  const categories = await Category.aggregate(pipeline);
  return {
    msg: msg.success,
    count: categories.length,
    result: categories,
  };
};

module.exports = {
  addCategories,
  getCategories,
};
