import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import FlowChart from 'flowchart-vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(FlowChart);
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
new Vue({
    router,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
