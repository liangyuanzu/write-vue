class Lue {
  constructor(options) {
    // 1.保存创建时候传递过来的数据
    if (this.isElement(options.el)) {
      this.$el = options.el;
    } else {
      this.$el = document.querySelector(options.el);
    }
    this.$data = options.data;
    // 2.根据指定的区域和数据去编译渲染界面
    if (this.$el) {
      new Compiler(this);
    }
  }
  isElement(node) {
    return node.nodeType === 1;
  }
}

class Compiler {
  constructor(vm) {
    this.vm = vm;
  }
}
