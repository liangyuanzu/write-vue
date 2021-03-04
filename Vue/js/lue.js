const CompilerUtil = {
  getValue(vm, value) {
    return value.split(".").reduce((data, currentKey) => {
      return data[currentKey.trim()];
    }, vm.$data);
  },
  getContent(vm, value) {
    const reg = /\{\{(.+?)\}\}/gi;
    const val = value.replace(reg, (...args) => {
      return this.getValue(vm, args[1]);
    });
    return val;
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
  content(text, value, vm) {
    text.textContent = this.getContent(vm, value);
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
      // 给外界传入的所有数据都添加get/set方法
      new Observer(this.$data);
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
      CompilerUtil["content"](text, content, this.vm);
    }
  }
}

class Observer {
  constructor(data) {
    this.observer(data);
  }
  observer(obj) {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        this.defineReactive(obj, key, obj[key]);
      }
    }
  }
  defineReactive(obj, attr, value) {
    // 如果属性的取值又是一个对象, 那么也需要给这个对象的所有属性添加get/set方法
    this.observer(value);
    /**
     * Object.defineProperty(obj, prop, descriptor)
     * 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象
     * @param {object} obj  要定义属性的对象。
     * @param  prop  要定义或修改的属性的名称或 Symbol 。
     * @param {object} descriptor  要定义或修改的属性描述符。
     *    @param {any} value  属性对应的值,可以是任意类型的值，默认为undefined
     *    @param {boolean} writable  属性的值是否可以被重写。默认为false。
     *    @param {boolean} enumerable  目标属性是否可以被枚举。默认为false。
     *    @param {boolean} configurable  目标属性是否可以被删除或是否可以再次修改特性。默认为false。
     */
    Object.defineProperty(obj, attr, {
      // 当使用了getter或setter方法，不允许使用writable和value这两个属性
      get: () => value, //当获取值的时候触发的函数
      set: (newValue) => {
        //当设置值的时候触发的函数
        if (value !== newValue) {
          // 如果给属性赋值的新值又是一个对象, 那么也需要给这个对象的所有属性添加get/set方法
          this.observer(newValue);
          value = newValue;
          console.log("监听到数据的变化, 需要去更新UI");
        }
      },
    });
  }
}
