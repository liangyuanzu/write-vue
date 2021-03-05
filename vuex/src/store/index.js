import Vue from "vue";
import Vuex from "./luex";
import home from "./modules/home";
import account from "./modules/account/account";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: "Jason_liang",
    age: 22,
    count: 0,
  },
  getters: {
    userInfo({ username, age }) {
      return `${username} - ${age}`;
    },
  },
  mutations: {
    addCount(state, num) {
      state.count += num;
    },
    addAge(state, age) {
      state.age += age;
    },
  },
  actions: {
    asyncAddAge({ commit }, age) {
      setTimeout(() => {
        commit("addAge", age);
      }, 1000);
    },
  },
  modules: {
    home,
    account,
  },
});
