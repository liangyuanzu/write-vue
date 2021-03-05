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
    this.state = options;
  }
}

export default {
  install,
  Store,
};