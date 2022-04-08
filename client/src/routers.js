import First from './view/firstPage.vue'
import Second from './view/secondPage.vue'
const routes = [{
        path: '/first',
        name: 'first',
        component: First,
    },
    {
        path: '/second',
        name: 'second',
        component: Second
    },
    {
        path: '/',
        redirect: '/first'
    }
];
export default routes;