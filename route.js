const User_routes = require("./src/app/modules/user/routes/user.route");
const Question_routes = require("./src/app/modules/question/routes/question.route");
const Category_routes = require("./src/app/modules/categories/routes/categories.route");

//All modules path and path-handler array
module.exports = [
  {
    path: "/api/user",
    handler: User_routes,
  }, {
    path: "/api/que",
    handler: Question_routes,
  }, {
    path: "/api/category",
    handler: Category_routes,
  },
];
