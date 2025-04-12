import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Интерсептор ответа для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Если ошибка 401 (неавторизован), пробуем обновить токен
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const refreshResponse = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
                    const newAccessToken = refreshResponse.data.access;

                    // Сохраняем новый access token в localStorage
                    localStorage.setItem('access_token', newAccessToken);

                    // Повторяем запрос с новым access token
                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                } catch (err) {
                    // Если не удалось обновить токен, нужно очистить данные и отправить пользователя на страницу логина
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login'; // Переход на страницу логина
                }
            }
        }

        // Если ошибка не 401, просто отдаем ошибку
        return Promise.reject(error);
    }
);

export default api;
