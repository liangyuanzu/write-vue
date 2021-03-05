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
    this.routesMap = this.createRoutesMap();
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

LueRouter.install = (Vue, options) => {
  Vue.mixin({
    beforeCreate() {
      if (this.$options?.router) {
        // 根组件
        this.$router = this.$options.router;
        this.$route = this.$router.routeInfo;
        // 双向数据绑定
        Vue.util.defineReactive(this, "xxx", this.$router);
      } else {
        // 子组件
        this.$router = this.$parent.$router;
        this.$route = this.$router.routeInfo;
      }
    },
  });

  // 注册全局组件
  Vue.component("router-link", {
    props: {
      to: String,
    },
    render() {
      let path = this.to;
      if (this._self.$router.mode === "hash") {
        path = "#" + path;
      }
      return <a href={path}>{this.$slots.default}</a>;
    },
  });
  Vue.component("router-view", {
    render(h) {
      const routesMap = this._self.$router.routesMap;
      const currentPath = this._self.$route.currentPath;
      const currentComponent = routesMap[currentPath];
      return h(currentComponent);
    },
  });
};

export default LueRouter;
