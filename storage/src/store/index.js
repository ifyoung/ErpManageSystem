import Vue from 'vue'
import Vuex from 'vuex'

Window.Vue = Vue;
Vue.use(Vuex);
let vStore = new Vuex.Store({
  state: {
    deleteCustomerSql: "123",
  },
  mutations: {},
  actions: {},
  modules: {},
});

export default vStore;
