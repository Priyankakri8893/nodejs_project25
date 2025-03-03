const UserRouteHandler = require("./src/app/modules/user/routes/UserRouteHandler");
const QuestionRouteHandler = require("./src/app/modules/question/routes/QuestionRouteHandler");
const CategoryRouteHandler = require("./src/app/modules/categories/routes/CategoryRouteHandler");
const Routes = require("./src/app/helpers/Routes");  

const routeHandler = new Routes();

routeHandler.addRoute("/api/user", UserRouteHandler.getRouter());
routeHandler.addRoute("/api/que", QuestionRouteHandler.getRouter());
routeHandler.addRoute("/api/category", CategoryRouteHandler.getRouter());

module.exports = routeHandler.getRoutes();
