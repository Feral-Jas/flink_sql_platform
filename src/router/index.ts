import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Flink from '../views/Flink.vue';
import FlinkSql from '../views/FlinkSql.vue';
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/flink',
        name: 'flink',
        component: Flink,
    },
    {
        path: '/flinksql',
        name: 'flinksql',
        component: FlinkSql,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
