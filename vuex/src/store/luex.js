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
  commit(type, payload) {
    this.mutations[type](payload);
  }
}

export default {
  install,
  Store,
};
