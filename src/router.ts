import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            name: 's-table-pro',
            path: '/components/s-table-pro',
            component: () => import(`../packages/s-table-pro/docs/README.md`),
        }
    ],
    scrollBehavior(to: any, from: any) {
        if (to.path !== from.path) {
            return { top: 0 };
        }
    },
});
