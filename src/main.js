import Vue from 'vue';
import App from './app.vue';

const eventHub = new Vue();
Vue.mixin({
  data: () => ({eventHub})
});

new Vue({el: '#app', render: h => h(App)});
