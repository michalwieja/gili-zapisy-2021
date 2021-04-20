import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import firebase from "firebase/app";
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import store from './store'

import "firebase/firestore";
import "firebase/auth";

Vue.config.productionTip = false
Vue.use(Datetime)

var firebaseConfig = {
  apiKey: "AIzaSyDvPGp8A1gZkySiHdK3D113YCBMkQlwTPY",
  authDomain: "giligili2021.firebaseapp.com",
  projectId: "giligili2021",
  storageBucket: "giligili2021.appspot.com",
  messagingSenderId: "532523061481",
  appId: "1:532523061481:web:866ff1b5db79fb79cc2078",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();

new Vue({
  store,
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
