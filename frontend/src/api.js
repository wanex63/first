import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Перехватываем 401 ошибку (истёк токен)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401 && !error.config._retry) {
            error.config._retry = true;
            const refresh = localStorage.getItem('refresh_token');
            const { data } = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
            localStorage.setItem('access_token', data.access);
            return api(error.config);
        }
        return Promise.reject(error);
    }
);

export default api;