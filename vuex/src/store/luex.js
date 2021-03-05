import Vue from "vue";

const install = (Vue, options) => {
  // 给每一个Vue实例都添加一个$store属性
  Vue.mixin({
    beforeCreate() {
      if (this.$options?.store) {
        // 如果是根组件, 那么默认就有store
        this.$store = this.$options.store;
      } else {
        // 如果不是根组件, 那么默认没有store，赋值父组件的 $store 即可
        this.$store = this.$parent.$store;
      }
    },
  });
};

class Store {
  constructor(options) {
    // this.state = options.state;
    // 将 state 变成双向绑定的数据
    Vue.util.defineReactive(this, "state", options.state);
    // 收集模块信息
    this.modules = new ModuleCollection(options);
    // 安装子模块数据
    this.initModules([], this.modules.root);
  }
  initGetters(options) {
    this.getters = this.getters || {};
    const newGetters = options.getters || {};
    for (const key in newGetters) {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return newGetters[key](options.state);
        },
      });
    }
  }
  initMutations(options) {
    this.mutations = this.mutations || {};
    const newMutations = options.mutations || {};
    for (const key in newMutations) {
      // 不同模块可以有同名的方法
      this.mutations[key] = this.mutations[key] || [];
      this.mutations[key].push((payload) => {
        newMutations[key](options.state, payload);
      });
    }
  }
  commit = (type, payload) => {
    this.mutations[type].forEach((fn) => fn(payload));
  };
  initActions(options) {
    this.actions = this.actions || {};
    const newActions = options.actions || {};
    for (const key in newActions) {
      this.actions[key] = this.actions[key] || [];
      this.actions[key].push((payload) => {
        newActions[key](this, payload);
      });
    }
  }
  dispatch = (type, payload) => {
    this.actions[type].forEach((fn) => fn(payload));
  };
  initModules(arr, rootModule) {
    if (arr.length > 0) {
      // 子模块
      const parent = arr.splice(0, arr.length - 1).reduce((state, currentKey) => {
        return state[currentKey];
      }, this.state);
      Vue.set(parent, arr[arr.length - 1], rootModule._state);
    }
    // 将数据绑定到 Store 上
    this.initGetters(rootModule._raw);
    this.initMutations(rootModule._raw);
    this.initActions(rootModule._raw);
    // 根模块
    for (const childrenModuleName in rootModule._children) {
      const childrenModule = rootModule._children[childrenModuleName];
      this.initModules(arr.concat(childrenModuleName), childrenModule);
    }
  }
}

class ModuleCollection {
  constructor(rootModule) {
    this.register([], rootModule);
  }
  register(arr, rootModule) {
    // 1. 创建模板
    const module = {
      _raw: rootModule,
      _state: rootModule.state,
      _children: {},
    };
    // 2.保存模块信息
    if (arr.length === 0) {
      // 根模块
      this.root = module;
    } else {
      // 子模块
      const parent = arr.splice(0, arr.length - 1).reduce((root, currentKey) => {
        return root._children[currentKey];
      }, this.root);
      parent._children[arr[arr.length - 1]] = module;
    }
    // 3.处理子模块
    for (const childrenModuleName in rootModule.modules) {
      const childrenModule = rootModule.modules[childrenModuleName];
      this.register(arr.concat(childrenModuleName), childrenModule);
    }
  }
}

export default {
  install,
  Store,
};
