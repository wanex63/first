import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import FavoritesPage from './pages/FavoritesPage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import NotFoundPage from './pages/NotFoundPage';

// Типизация для ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return currentUser ? children : null;
}

const router = createBrowserRouter([
  {
    element: <MainLayout />, // Основной layout с Header и Footer
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movie/:id",
        element: <MoviePage />,
      },
      {
        path: "/favorites",
        element: <ProtectedRoute><FavoritesPage /></ProtectedRoute>,
      },
      {
        path: "/profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
    ],
  },
  {
    element: <AuthLayout />, // Упрощенный layout для авторизации
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}