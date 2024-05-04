class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(watch) {
    this.subs.push(watch);
  }

  notice() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

function observer(value) {
  if (!value || typeof value !== "object") {
    return;
  }

  Object.keys(value).forEach((key) => {
    defineReactive(value, key, value[key]);
  });
}

function cb(val) {
  console.log("视图更新啦～", val);
}

function defineReactive(obj, key, val) {
  const deps = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      deps.addSub({ update: () => {} });
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      val = newVal;
      deps.notice();
      cb(newVal);
    },
  });
}

class Vue {
  constructor(options) {
    this._data = options.data;
    observer(this._data);
  }
}

let o = new Vue({
  data: {
    test: "I am test.",
  },
});

// 首先在 observer 的过程中会注册 get 方法，该方法用来进行「依赖收集」。
// 在它的闭包中会有一个 Dep 对象，这个对象用来存放 Watcher 对象的实例。
// 其实「依赖收集」的过程就是把 Watcher 实例存放到对应的 Dep 对象中去。
// get 方法可以让当前的 Watcher 对象（Dep.target）存放到它的 subs 中（addSub）方法，在数据变化时，set 会调用 Dep 对象的 notify 方法通知它内部所有的 Watcher 对象进行视图更新。
