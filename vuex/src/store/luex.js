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
    this.initGetters(options);
    this.initMutations(options);
    this.initActions(options);
    // 收集模块信息
    this.modules = new ModuleCollection(options);
    console.log(this.modules);
  }
  initGetters(options) {
    this.getters = {};
    const newGetters = options.getters || {};
    for (const key in newGetters) {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return newGetters[key](this.state);
        },
      });
    }
  }
  initMutations(options) {
    this.mutations = {};
    const newMutations = options.mutations || {};
    for (const key in newMutations) {
      this.mutations[key] = (payload) => {
        newMutations[key](this.state, payload);
      };
    }
  }
  commit = (type, payload) => {
    this.mutations[type](payload);
  };
  initActions(options) {
    this.actions = {};
    const newActions = options.actions || {};
    for (const key in newActions) {
      this.actions[key] = (payload) => {
        newActions[key](this, payload);
      };
    }
  }
  dispatch = (type, payload) => {
    this.actions[type](payload);
  };
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
