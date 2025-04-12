import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function HomePage() {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreQuery, setGenreQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedGenreQuery = useDebounce(genreQuery, 300);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_KINOPOISK_API_KEY;
      if (!apiKey) {
        throw new Error('Kinopoisk API key is missing in environment variables');
      }

      // Правильные параметры для API v1.4
      const response = await axios.get('https://api.kinopoisk.dev/v1.4/movie', {
        params: {
          lists: 'top250',
          page: currentPage,
          limit: moviesPerPage,
          selectFields: ['id', 'name', 'year', 'rating', 'poster', 'genres', 'description'],
          notNullFields: ['poster.url', 'name', 'year']
        },
        headers: {
          'X-API-KEY': apiKey,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const formattedMovies = response.data.docs.map(movie => ({
        id: movie.id,
        title: movie.name || 'Без названия',
        year: movie.year || 'Н/Д',
        rating: movie.rating?.imdb || movie.rating?.kp || 0,
        genres: movie.genres?.map(g => g.name) || ['Жанр не указан'],
        posterUrl: movie.poster?.url || `https://st.kp.yandex.net/images/film_iphone/iphone360_${movie.id}.jpg`,
        description: movie.description || 'Описание отсутствует'
      }));

      setMovies(formattedMovies);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.response?.data?.message || err.message || 'Ошибка загрузки фильмов');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchMovies();
    return () => controller.abort();
  }, [fetchMovies]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredMovies = movies.filter(movie => {
    const titleMatch = movie.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    const genreMatch = movie.genres.some(g =>
      g.toLowerCase().includes(debouncedGenreQuery.toLowerCase())
    );
    return titleMatch && genreMatch;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8 p-4 bg-gray-800 rounded-lg gap-4">
          <h1 className="text-4xl font-bold text-yellow-500 text-center w-full">
            {searchQuery ? `Поиск: "${searchQuery}"` : 'Кинопоиск'}
          </h1>
        </header>

        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            {currentUser ? (
              <Link to="/profile" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors">
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Профиль</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors">
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Войти</span>
              </Link>
            )}
            <Link to="/favorites" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors">
              <HeartIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Избранное</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Фильтр по жанру..."
              value={genreQuery}
              onChange={e => setGenreQuery(e.target.value)}
              className="p-2 text-gray-800 rounded-lg"
            />
          </div>
        </div>

        <SearchBar onSearch={handleSearchChange} className="mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Фильмы не найдены</p>
          </div>
        )}

        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            Назад
          </button>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={filteredMovies.length < moviesPerPage}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
}