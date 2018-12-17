import Vue from 'vue'
import Vuex from 'vuex'

import armors from '../db/armors.json';
import charms from '../db/charms.json';
import items from '../db/items.json';
import skills from '../db/skills.json';

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
