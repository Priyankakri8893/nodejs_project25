class Routes {
  constructor() {
    this.routes = [];
  }

  addRoute(path, handler) {
    this.routes.push({ path, handler });
  }

  getRoutes() {
    return this.routes;
  }
}

module.exports = Routes;
