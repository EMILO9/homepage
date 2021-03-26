import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    selectedMedia: null,
    pcs: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setMedia (state, payload) {
      state.selectedMedia = payload
    },
    setPcs (state, payload) {
      state.pcs = payload
    }
  },
  actions: {},
  modules: {},
  getters: {
    user: (state) => state.user,
    selectedMedia: (state) => state.selectedMedia,
    pcs: (state) => state.pcs
  }
});
