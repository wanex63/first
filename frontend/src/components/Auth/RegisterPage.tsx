import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Подключаем настроенный axios

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const response = await api.post('auth/register/', {
      username,
      email,
      password,
      password2,
    });
    console.log('Успешная регистрация:', response.data);
    history.push('/login');
  } catch (err) {
    if (err.response?.data) {
      console.error('Ошибка при регистрации:', err.response.data);
      const errors = err.response.data;
      const messages = Object.entries(errors)
        .map(([key, value]) => `${key}: ${value.join(' ')}`)
        .join('\n');
      setError(messages);
    } else {
      console.error('Ошибка:', err.message);
      setError('Произошла ошибка. Попробуйте позже.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Регистрация</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Придумайте логин"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Ваш email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Придумайте пароль"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Подтвердите пароль</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Повторите пароль"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-black font-bold py-2 px-4 rounded transition`}
          >
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Войдите
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
