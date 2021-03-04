const CompilerUtil = {
  getValue(vm, value) {
    return value.split(".").reduce((data, currentKey) => {
      return data[currentKey];
    }, vm.$data);
  },
  model(node, value, vm) {
    node.value = this.getValue(vm, value);
  },
  html(node, value, vm) {
    node.innerHTML = this.getValue(vm, value);
  },
  text(node, value, vm) {
    node.innerText = this.getValue(vm, value);
  },
};

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
    // 1. 将网页上的元素放到内存中
    const fragment = this.node2fragment(this.vm.$el);
    // 2. 利用指定的数据编译内存中的元素
    this.buildTemplate(fragment);
    // 3. 将编译好的内容重新渲染到页面
    this.vm.$el.appendChild(fragment);
  }
  node2fragment(app) {
    // 1. 创建一个空的文档碎片对象
    const newFragment = document.createDocumentFragment();
    // 2. 遍历循环取到每一个元素
    let node = app.firstChild;
    while (node) {
      // 注意: 主要将元素添加到文档碎片对象中, 那么这个元素就会自动从网页中消失
      newFragment.appendChild(node);
      node = app.firstChild;
    }
    // 3. 返回存储了所有元素的文档碎片对象
    return newFragment;
  }
  buildTemplate(fragment) {
    const nodeList = [...fragment.childNodes];
    nodeList.forEach((node) => {
      if (this.vm.isElement(node)) {
        this.buildElement(node);
        // 处理后代
        this.buildTemplate(node);
      } else {
        this.buildText(node);
      }
    });
  }
  buildElement(node) {
    const attrs = [...node.attributes];
    attrs.forEach((attr) => {
      const { name, value } = attr;
      if (name.startsWith("v-")) {
        const [_, directive] = name.split("-");
        CompilerUtil[directive](node, value, this.vm);
      }
    });
  }
  buildText(text) {
    const content = text.textContent;
    const reg = /\{\{.+?\}\}/gi;
    if (reg.test(content)) {
      console.log("是 {{}} 文本", content);
    }
  }
}
