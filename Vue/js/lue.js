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
  setValue(vm, attr, newValue) {
    attr.split(".").reduce((data, currentAttr, index, arr) => {
      if (index === arr.length - 1) {
        data[currentAttr] = newValue;
      }
      return data[currentAttr];
    }, vm.$data);
  },
  model(node, value, vm) {
    // 第二步: 在第一次渲染的时候, 就给所有的属性添加观察者
    new Watcher(vm, value, (newVal) => {
      node.value = newVal;
    });
    node.value = this.getValue(vm, value);

    node.addEventListener("input", (e) => {
      const newValue = e.target.value;
      this.setValue(vm, value, newValue);
    });
  },
  html(node, value, vm) {
    new Watcher(vm, value, (newVal) => {
      node.innerHTML = newVal;
    });
    node.innerHTML = this.getValue(vm, value);
  },
  text(node, value, vm) {
    new Watcher(vm, value, (newVal) => {
      node.innerText = newVal;
    });
    node.innerText = this.getValue(vm, value);
  },
  content(text, value, vm) {
    // 外层是拿到属性名称
    const reg = /\{\{(.+?)\}\}/gi;
    const val = value.replace(reg, (...args) => {
      // 内层保证数据完整性
      new Watcher(vm, args[1], () => {
        text.textContent = this.getContent(vm, value);
      });
      return this.getValue(vm, args[1]);
    });
    text.textContent = val;
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
      // 第一步: 给外界传入的所有数据都添加get/set方法
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
    // 第三步：将当前属性的所有观察者对象都放到当前属性的发布订阅对象中管理起来
    const dep = new Dep(); // 创建当前属性的发布订阅对象
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
      get: () => {
        //当获取值的时候触发的函数
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newValue) => {
        //当设置值的时候触发的函数
        if (value !== newValue) {
          // 如果给属性赋值的新值又是一个对象, 那么也需要给这个对象的所有属性添加get/set方法
          this.observer(newValue);
          value = newValue;
          dep.notify();
          console.log("监听到数据的变化, 需要去更新UI");
        }
      },
    });
  }
}

/**
 * 发布订阅模式实现数据变化后更新 UI 界面
 * 分别定义一个观察者类和发布订阅类，通过发布订阅类管理观察者类
 * */

// 观察者
class Watcher {
  constructor(vm, attr, cb) {
    this.vm = vm;
    this.attr = attr;
    this.cb = cb;
    this.oldValue = this.getOldValue();
  }
  getOldValue() {
    // 全局变量保存当前观察者对象
    Dep.target = this;
    const val = CompilerUtil.getValue(this.vm, this.attr);
    Dep.target = null;
    return val;
  }
  update() {
    const newValue = CompilerUtil.getValue(this.vm, this.attr);
    if (newValue !== this.oldValue) {
      this.cb(newValue, this.oldValue);
    }
  }
}
// 发布订阅
class Dep {
  constructor() {
    this.subs = []; // 用于管理某个属性所有的观察者对象
  }
  // 订阅观察
  addSub(watch) {
    this.subs.push(watch);
  }
  // 发布订阅
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}
