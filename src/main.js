import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './assets/sass/style.scss'

import Router from 'vue-router'
import axios from "axios";

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
};

require('@/store/subscriber');
axios.defaults.baseURL = process.env.VUE_APP_BACKEND + '/api/';
Vue.config.productionTip = false

store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
    new Vue({
        router,
        store,
        vuetify,
        render: h => h(App)
    }).$mount('#app')
})
