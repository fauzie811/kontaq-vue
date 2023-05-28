import { reactive } from 'vue';

const token = localStorage.getItem('token');

export default reactive({
    token,
    user: null,
    isLoggedIn: token != null,

    setToken(token) {
        localStorage.setItem('token', token);
        this.token = token;
        this.isLoggedIn = true;
    },
    clearToken() {
        localStorage.removeItem('token');
        this.token = null;
        this.user = null;
        this.isLoggedIn = false;
    },
});
