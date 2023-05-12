import { createRouter, createWebHashHistory } from 'vue-router';

import authStore from './store/auth';
import BlankLayout from './layouts/Blank.vue';
import MainLayout from './layouts/Main.vue';
import QuizLayout from './layouts/Quiz.vue';
import Login from './pages/Auth/Login.vue';
import Home from './pages/Home.vue';

/** @type {import('vue-router').RouteRecordRaw[]} */
const routes = [
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: { layout: BlankLayout },
    },
    {
        path: '/',
        component: Home,
        name: 'home',
        meta: { layout: MainLayout },
    },
    {
        path: '/materials',
        component: () => import('./pages/Materials.vue'),
        name: 'materials',
        meta: { layout: MainLayout },
    },
    {
        path: '/materials/:id',
        component: () => import('./pages/Materials/Show.vue'),
        name: 'materials.show',
        meta: { layout: MainLayout },
    },
    {
        path: '/quizzes',
        component: () => import('./pages/Quizzes.vue'),
        name: 'quizzes',
        meta: { layout: MainLayout },
    },
    {
        path: '/quizzes/:id',
        component: () => import('./pages/Quizzes/Show.vue'),
        name: 'quizzes.show',
        meta: { layout: QuizLayout },
    },
    {
        path: '/evaluations',
        component: () => import('./pages/Evaluations.vue'),
        name: 'evaluations',
        meta: { layout: MainLayout },
    },
    {
        path: '/reports',
        component: () => import('./pages/Reports.vue'),
        name: 'reports',
        meta: { layout: MainLayout },
    },
    {
        path: '/certificates',
        component: () => import('./pages/Certificates.vue'),
        name: 'certificates',
        meta: { layout: MainLayout },
    },
    {
        path: '/announcements',
        component: () => import('./pages/Announcements.vue'),
        name: 'announcements',
        meta: { layout: MainLayout },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !authStore.isLoggedIn) next({ name: 'login' });
    else if (to.name === 'login' && authStore.isLoggedIn)
        next({ name: 'home ' });
    else next();
});

export default router;
