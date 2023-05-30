import { createRouter, createWebHashHistory } from 'vue-router';

import authStore from './store/auth';
import AuthLayout from './layouts/Auth.vue';
import BlankLayout from './layouts/Blank.vue';
import MainLayout from './layouts/Main.vue';
import QuizLayout from './layouts/Quiz.vue';
import Login from './pages/Auth/Login.vue';
import Register from './pages/Auth/Register.vue';
import Logout from '@/pages/Auth/Logout.vue';
import Home from './pages/Home.vue';

/** @type {import('vue-router').RouteRecordRaw[]} */
const routes = [
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: { layout: AuthLayout },
    },
    {
        path: '/register',
        component: Register,
        name: 'register',
        meta: { layout: AuthLayout },
    },
    {
        path: '/logout',
        component: Logout,
        name: 'logout',
        meta: { needsAuth: true, layout: BlankLayout },
    },
    {
        path: '/',
        component: Home,
        name: 'home',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/materials',
        component: () => import('./pages/Materials.vue'),
        name: 'materials',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/materials/:id',
        component: () => import('./pages/Materials/Show.vue'),
        name: 'materials.show',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/quizzes',
        component: () => import('./pages/Quizzes.vue'),
        name: 'quizzes',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/quizzes/:id',
        component: () => import('./pages/Quizzes/Show.vue'),
        name: 'quizzes.show',
        meta: { needsAuth: true, layout: QuizLayout },
    },
    {
        path: '/evaluations',
        component: () => import('./pages/Evaluations.vue'),
        name: 'evaluations',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/evaluations/:id',
        component: () => import('./pages/Evaluations/Show.vue'),
        name: 'evaluations.show',
        meta: { needsAuth: true, layout: QuizLayout },
    },
    {
        path: '/reports',
        component: () => import('./pages/Reports.vue'),
        name: 'reports',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/certificates',
        component: () => import('./pages/Certificates.vue'),
        name: 'certificates',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/announcements',
        component: () => import('./pages/Announcements.vue'),
        name: 'announcements',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/announcements/:id',
        component: () => import('./pages/Announcements/Show.vue'),
        name: 'announcements.show',
        meta: { needsAuth: true, layout: MainLayout },
    },
    {
        path: '/profile',
        component: () => import('./pages/Profile.vue'),
        name: 'profile',
        meta: { needsAuth: true, layout: MainLayout },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && to.meta.needsAuth && !authStore.isLoggedIn)
        next({ name: 'login' });
    else if (to.name === 'login' && authStore.isLoggedIn)
        next({ name: 'home ' });
    else next();
});

export default router;
