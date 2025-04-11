import { Link, NavLink } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-yellow-500 font-bold text-2xl">KinoPoisk</span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-yellow-500' : 'hover:text-yellow-400'
            }
          >
            Главная
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? 'text-yellow-500' : 'hover:text-yellow-400'
            }
          >
            Избранное
          </NavLink>
        </nav>

        {/* Поиск и авторизация */}
        <div className="flex items-center gap-4">
          <Link to="/search" className="p-2 hover:text-yellow-500">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </Link>
          {currentUser ? (
            <Link to="/profile" className="p-2 hover:text-yellow-500">
              <UserIcon className="h-5 w-5" />
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
              >
                Войти
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}