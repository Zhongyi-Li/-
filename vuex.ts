let Vue;
class Store {
  _vm: Record<string, any>;
  //   state: Record<string, any>;
  mutations: Record<string, any>;
  actoins: Record<string, any>;
  getters: Record<string, any>;
  constructor(options) {
    this._vm = new Vue({
      data: options.state,
    });

    this.mutations = options.mutations;
    this.actoins = options.actions;
    this.getters = {};
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);

    options.getters && this.handleGetters(options.getters);
  }

  get state() {
    return this._vm._data_.$$state;
  }

  handleGetters(getters) {
    Object.keys(getters).map((key) => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](this.state),
      });
    });
  }

  commit(type, payload) {
    const entry = this.mutations[type];
    if (entry) {
      entry(this.state, payload);
    }
  }

  dispatch(type, payload) {
    const entry = this.actoins[type];
    if (entry) {
      entry(this, payload);
    }
  }
}
const install = (_vue) => {
  Vue = _vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.Prototype.$store = this.$option.store;
      }
    },
  });
};

export default { Store, install };
