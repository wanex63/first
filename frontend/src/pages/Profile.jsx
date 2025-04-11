import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import MovieCard from '../components/MovieCard';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const movies = querySnapshot.docs.map(doc => doc.data().movie);
        setFavoriteMovies(movies);
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser, navigate]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      alert('Не удалось выйти');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-500">Личный кабинет</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Выйти
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-700 p-3 rounded-full">
            <UserIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentUser.email}</h2>
            <p className="text-gray-400">Пользователь</p>
          </div>
          <button className="ml-auto text-yellow-500 hover:text-yellow-400">
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Избранных фильмов</h3>
            <p className="text-xl font-bold">{favoriteMovies.length}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Дата регистрации</h3>
            <p className="text-xl font-bold">
              {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Избранные фильмы</h2>
        {favoriteMovies.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            У вас пока нет избранных фильмов
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favoriteMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}