// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './components/Home/HomePage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import MovieDetails from './components/Movie/MovieDetails';
import Navbar from './components/Navbar/Navbar';
import UserProfile from './components/User/UserProfile';
import FavoritesPage from './components/Favorites/FavoritesPage';
import AdminPanel from './components/Admin/AdminPanel';
import SearchResults from './components/Search/SearchResults';
import axios from 'axios';

// Настройка axios для работы с Django
axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

// Компонент для защищённых маршрутов
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Проверка авторизации...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.is_staff) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Проверяем тему в localStorage
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    
    // Применяем тему к body
    if (savedMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.body.classList.toggle('dark-mode', newMode);
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/search" element={<SearchResults />} />
              
              {/* Защищённые маршруты */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } />
              
              <Route path="/favorites" element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              } />
              
              <Route path="/admin" element={
                <PrivateRoute adminOnly>
                  <AdminPanel />
                </PrivateRoute>
              } />
              
              {/* 404 страница */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <footer className="footer">
            <p>© {new Date().getFullYear()} KINOPOISK. Все права защищены.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;