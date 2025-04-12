import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signup(email, password);
      navigate('/');  // Переход на главную страницу после успешной регистрации
    } catch (err) {
      setError('Не удалось зарегистрироваться. Попробуйте позже.');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl text-center text-white mb-4">Регистрация</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="text-white">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 rounded-md border border-gray-700 bg-gray-900 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="text-white">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 rounded-md border border-gray-700 bg-gray-900 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
