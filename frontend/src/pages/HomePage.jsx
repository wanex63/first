import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function HomePage() {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://api.kinopoisk.dev/v1.4/movie', {
          params: {
            lists: 'top250',
            limit: 10,
            selectFields: ['id', 'name', 'year', 'rating', 'poster', 'genres']
          },
          headers: {
            'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY
          }
        });

        const formattedMovies = response.data.docs.map(movie => ({
          id: movie.id,
          title: movie.name,
          year: movie.year,
          rating: movie.rating?.imdb || 0,
          genre: movie.genres?.[0]?.name || 'Неизвестно',
          poster: movie.poster?.url || 'https://via.placeholder.com/300x450'
        }));

        setMovies(formattedMovies);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Не удалось загрузить фильмы. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Шапка */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-gray-800 rounded-lg gap-4">
          <h1 className="text-2xl font-bold text-yellow-500">
            {searchQuery ? `Поиск: "${searchQuery}"` : 'Топ фильмов с Кинопоиска'}
          </h1>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
                aria-label="Профиль"
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Профиль</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
                aria-label="Войти"
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Войти</span>
              </Link>
            )}
            <Link
              to="/favorites"
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
              aria-label="Избранное"
            >
              <HeartIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Избранное</span>
            </Link>
          </div>
        </header>

        {/* Поиск */}
        <SearchBar onSearch={setSearchQuery} className="mb-8" />

        {/* Список фильмов */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}