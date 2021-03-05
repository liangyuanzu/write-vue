import login from "./modules/login";

export default {
  state: {
    age: 50,
  },
  getters: {},
  mutations: {
    addAge(state, age) {
      console.log("account的 addAge");
      state.age += age;
    },
  },
  actions: {
    asyncAddAge({ commit }, age) {
      console.log("account的 asyncAddAge");
      setTimeout(() => {
        commit("addAge", age);
      }, 1000);
    },
  },
  modules: {
    login,
  },
};
