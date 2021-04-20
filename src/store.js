import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main';

Vue.use(Vuex)

const getters = {
  logged_user: state => state.user,
  events: state => state.events,
  users: state => state.users,
}

const mutations = {

  SET_USER(state, payload) {
    state.user = payload
  },
  FETCH_EVENTS(state, payload) {
    state.events = payload
  },
  FETCH_USERS(state, payload) {
    state.users = payload
  }
}

const actions = {
  async fetchEvents({ commit }) {
    try {
      let snapshot = await db.collection('schedule').get();
      const events = [];
      snapshot.forEach((doc) => {
        let eventData = doc.data();
        eventData.id = doc.id;
        events.push(eventData);
      });
      commit('FETCH_EVENTS', events)

    }
    catch (e) {
      console.warn(e);
    }
  },

  async fetchUsers({ commit }) {
    try {
      let snapshot = await db.collection('users').get();
      const users = [];
      snapshot.forEach(doc => {
        const userData = doc.data();
        users.push(userData)
      })

      commit('FETCH_USERS', users)

    }
    catch (e) {
      console.warn(e);
    }
  },

  setUser({ commit }, payload) {
    commit('SET_USER', payload)
  },
}
export default new Vuex.Store({
  state: {
    user: null,
    events: [],
    users: []
  },
  actions, mutations, getters
})
