import axios from 'axios';

import router from '@/router';
import authStore from '@/store/auth';

window.axios = axios;

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.interceptors.request.use(
    (config) => {
        if (authStore.token && config.url != '/login') {
            config.headers['Authorization'] = `Bearer ${authStore.token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    (response) => {
        if (response.data.status === 'error') {
            return Promise.reject(response.data.message);
        } else if (
            response.data &&
            response.data.message == 'Unauthenticated.'
        ) {
            authStore.clearToken();
            router.push({ name: 'login' });
        }
        return response;
    },
    (error) => {
        if (!error.response) {
            return Promise.reject('Koneksi gagal.');
        } else if (error.response.status === 401) {
            authStore.clearToken();
            if (router.currentRoute.name != 'login')
                router.push({ name: 'login' });
            return Promise.reject(error.response.data.message || error);
        } else if (error.response.data && error.response.data.message) {
            return Promise.reject(error.response.data.message);
        }
        return Promise.reject(error);
    }
);

export const register = async (data) => {
    try {
        const res = await axios.post('auth/register', data);
        authStore.setToken(res.data.token);
    } catch (e) {
        throw e;
    }
};

export const login = async ({ login, password }) => {
    try {
        const res = await axios.post('auth/login', { login, password });
        authStore.setToken(res.data.token);
    } catch (e) {
        throw e;
    }
};

export const logout = async () => {
    try {
        await axios.post('auth/logout');
        authStore.clearToken();
    } catch (e) {
        throw e;
    }
};

export const getUser = async () => {
    try {
        const { data } = await axios.get('me');
        authStore.user = data.data;
    } catch (e) {
        throw e;
    }
};

export const getProfile = async () => {
    try {
        const { data } = await axios.get('me/profile');
        return data;
    } catch (e) {
        throw e;
    }
};

export const updateProfile = async (profile) => {
    try {
        const { data } = await axios.put('me/profile', profile);
        return data;
    } catch (e) {
        throw e;
    }
};

export const listCategories = async (rootOnly = false) => {
    try {
        const { data } = await axios.get('categories', {
            params: { rootOnly: rootOnly ? 1 : 0 },
        });
        return data;
    } catch (e) {
        throw e;
    }
};

export const listMyMaterials = async ({ page = 1, category = null }) => {
    try {
        const { data } = await axios.get('me/materials', {
            params: { page, category },
        });
        return data;
    } catch (e) {
        throw e;
    }
};

export const getMyMaterial = async (id) => {
    try {
        const { data } = await axios.get(`me/materials/${id}`);
        return data;
    } catch (e) {
        throw e;
    }
};

export const updateMyMaterial = async (id) => {
    try {
        const { data } = await axios.put(`me/materials/${id}`);
        return data;
    } catch (e) {
        throw e;
    }
};

export const getReports = async (category_id = 1) => {
    try {
        const { data } = await axios.post('me/group/report/', { category_id });
        return data;
    } catch (e) {
        throw e;
    }
};

export const listAnnouncements = async (page = 1) => {
    try {
        const { data } = await axios.get('announcements', { params: { page } });
        return data;
    } catch (e) {
        throw e;
    }
};

export const getAnnouncement = async (id) => {
    try {
        const { data } = await axios.get(`announcements/${id}`);
        return data;
    } catch (e) {
        throw e;
    }
};

export const listMyQuizzes = async ({ page = 1, category = null }) => {
    try {
        const { data } = await axios.get('me/quizzes', {
            params: { page, category },
        });
        return data;
    } catch (e) {
        throw e;
    }
};

export const getMyQuiz = async (id) => {
    try {
        const { data } = await axios.get(`me/quizzes/${id}`);
        return data;
    } catch (e) {
        throw e;
    }
};

export const updateMyQuiz = async (id, answers) => {
    try {
        const { data } = await axios.put(`me/quizzes/${id}`, { answers });
        return data;
    } catch (e) {
        throw e;
    }
};

export const listMyEvaluations = async ({ page = 1, category = null }) => {
    try {
        const { data } = await axios.get('me/evaluations', {
            params: { page, category },
        });
        return data;
    } catch (e) {
        throw e;
    }
};

export const getMyEvaluation = async (id) => {
    try {
        const { data } = await axios.get(`me/evaluations/${id}`);
        return data;
    } catch (e) {
        throw e;
    }
};

export const updateMyEvaluation = async (id, answers) => {
    try {
        const { data } = await axios.put(`me/evaluations/${id}`, { answers });
        return data;
    } catch (e) {
        throw e;
    }
};
