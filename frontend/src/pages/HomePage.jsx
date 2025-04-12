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
  const [genreQuery, setGenreQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 10;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://api.kinopoisk.dev/v1.4/movie', {
          params: {
            lists: 'top250',
            page: currentPage,
            limit: 50,
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
        setTotalPages(response.data.pages);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Не удалось загрузить фильмы. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Сбрасываем страницу на первую при изменении запроса
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    movie.genre.toLowerCase().includes(genreQuery.toLowerCase())
  );

  // Пагинация для других фильмов (по 10 штук на странице)
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Шапка */}
        <header className="flex justify-between items-center mb-8 p-4 bg-gray-800 rounded-lg gap-4">
          <h1 className="text-4xl font-bold text-yellow-500 text-center w-full">
            {searchQuery ? `Поиск: "${searchQuery}"` : 'Кинопоиск'}
          </h1>
        </header>

        {/* Линия с кнопками и поиском по жанрам */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
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
          {/* Поиск по жанрам */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Введите жанр..."
              value={genreQuery}
              onChange={e => setGenreQuery(e.target.value)}
              className="p-2 text-gray-800 rounded-lg"
            />
          </div>
        </div>

        {/* Топ 5 фильмов */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-yellow-500 mb-4">Топ 5 фильмов</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredMovies.slice(0, 5).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Поиск по фильмам */}
        <SearchBar onSearch={handleSearchChange} className="mb-8" />

        {/* Отображение оставшихся фильмов с пагинацией */}
        {currentMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Ничего не найдено</p>
          </div>
        )}

        {/* Пагинация */}
        {filteredMovies.length > moviesPerPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Предыдущая
            </button>
            <span className="mx-4 text-lg text-yellow-500">
              Страница {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prevPage => prevPage + 1)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Следующая
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
