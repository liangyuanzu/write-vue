class LueRouterInfo {
  constructor() {
    this.currentPath = null;
  }
}

class LueRouter {
  constructor(options) {
    this.mode = options.mode || "hash";
    this.routes = options.routes || [];
    // 提取路由信息
    this.routersMap = this.createRoutesMap();
    // 初始化路由信息
    this.routeInfo = new LueRouterInfo();
    this.initDefault();
  }
  createRoutesMap() {
    return this.routes.reduce((map, route) => {
      map[route.path] = route.component;
      return map;
    }, {});
  }
  initDefault() {
    if (this.mode === "hash") {
      console.log(location.hash);
      if (!location.hash) {
        location.hash = "/";
      }
      window.addEventListener("load", () => {
        this.routeInfo.currentPath = location.hash.slice(1);
      });
      window.addEventListener("hashchange", () => {
        this.routeInfo.currentPath = location.hash.slice(1);
        console.log(this.routeInfo);
      });
    } else {
      if (!location.pathname) {
        location.pathname = "/";
      }
      window.addEventListener("load", () => {
        this.routeInfo.currentPath = location.pathname;
      });
      window.addEventListener("popstate", () => {
        this.routeInfo.currentPath = location.pathname;
        console.log(this.routeInfo);
      });
    }
  }
}

LueRouter.install = (Vue, options) => {};

export default LueRouter;
