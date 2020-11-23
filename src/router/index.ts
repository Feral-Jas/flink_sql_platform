import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Flink from '../views/Flink.vue';
import Home from '../views/Home.vue';
import Flowchart from '../views/Flowchart.vue';
import FlowchartNew from '../views/FlowchartNew.vue';
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/flink',
        name: 'flink',
        component: Flink,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
