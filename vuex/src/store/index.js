import Vue from "vue";
import Vuex from "./luex";

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
  },
  actions: {},
  modules: {},
});
