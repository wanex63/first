// 1. Импортируем всё необходимое
import React from 'react';
import { Link } from 'react-router-dom'; // Для ссылок

// 2. Создаем компонент
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Вход</h2>

        {/* Поля формы */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Ваш email"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Пароль</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Пароль"
            />
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition"
          >
            Войти
          </button>
        </div>

        {/* Ссылка на регистрацию */}
        <p className="mt-6 text-center text-gray-400">
          Нет аккаунта?{' '}
          <Link
            to="/register"
            className="text-yellow-500 hover:underline"
          >
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
};

// 3. Экспортируем компонент
export default LoginPage;