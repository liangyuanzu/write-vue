export default {
  state: {
    score: 0,
  },
  getters: {
    getHomeScore(state) {
      return state.score;
    },
  },
  mutations: {
    setHomeScore(state, score) {
      state.score += score;
    },
  },
  actions: {
    asyncSetHomeScore({ commit }, score) {
      setTimeout(() => {
        commit("setHomeScore", score);
      }, 2000);
    },
  },
};
