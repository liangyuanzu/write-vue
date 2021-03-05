class LueRouter {
  constructor(options) {
    this.mode = options.mode || "hash";
    this.routes = options.routes || [];
    // 提取路由信息
    this.routersMap = this.createRouteMap();
    console.log(this.routersMap);
  }
  createRouteMap() {
    return this.routes.reduce((map, route) => {
      map[route.path] = route.component;
      return map;
    }, {});
  }
}

LueRouter.install = (Vue, options) => {};

export default LueRouter;
