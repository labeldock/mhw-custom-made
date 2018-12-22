import Vue from 'vue'
import Vuex from 'vuex'

import armors from './assets/armors.json';
import charms from './assets/charms.json';
import items from './assets/items.json';
import skills from './assets/skills.json';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    armors,
    charms,
    items,
    skills,
  },
  mutations: {

  },
  actions: {

  }
})
