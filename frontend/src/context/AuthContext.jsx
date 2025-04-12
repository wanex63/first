import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загружаем токены из localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        email,
        password,
      });

      const { access, refresh } = response.data;

      const user = { email };
      setCurrentUser(user);
      setAccessToken(access);

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const signup = async (email, password) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        email,
        password,
      });
      await login(email, password);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    accessToken,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}