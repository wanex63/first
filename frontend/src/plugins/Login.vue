<template>
    <div>
        <input v-model="username" type="text" placeholder="Логин" />
        <input v-model="password" type="password" placeholder="Пароль" />
        <button @click="login">Войти</button>
    </div>
</template>

<script>
import api from '@/plugins/axios';

export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        async login() {
            try {
                const response = await api.post('/token/', {
                    username: this.username,
                    password: this.password
                });
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                alert('Успешный вход!');
            } catch (error) {
                alert('Ошибка входа: ' + error.message);
            }
        }
    }
};
</script>