import Vue from 'vue'
import VueSocket from 'vue-socket.io'
import App from './App.vue'

const urlsocket = `${window.location.protocol}//${window.location.host}`;

Vue.use(VueSocket, urlsocket);

new Vue({
  el: '#app',
  render: h => h(App)
});