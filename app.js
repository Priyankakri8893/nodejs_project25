const Server = require("./src/app/helpers/Server");
const routes = require("./route");

const server = new Server();

server.configureMiddleware();
server.setupRoot();

routes.forEach((route) => {
    server.app.use(route.path, route.handler);
});

server.start();

module.exports = { server };
