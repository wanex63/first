import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Для навигации
import api from '../services/api'; // Импортируем настроенный axios

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Состояние для загрузки
  const history = useHistory(); // Для редиректа после успешного входа

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Начинаем загрузку

    try {
      const response = await api.post('auth/login/', {
        email,
        password,
      });

      // Если вход успешен, сохраняем токены в localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Перенаправляем на главную страницу или в нужное место
      history.push('/'); // или куда нужно
    } catch (err) {
      setError('Неверный email или пароль');
      console.error(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Вход</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Ваш email"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Пароль"
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-black font-bold py-2 px-4 rounded transition`}
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-yellow-500 hover:underline">
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
