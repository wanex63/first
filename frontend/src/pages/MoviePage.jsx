import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.movies.favorites);
  const isFavorite = favorites.some(f => f.id === id);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
          headers: {
            'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY
          }
        });

        setMovie(response.data);

        // Загрузка похожих фильмов
        const similarResponse = await axios.get('https://api.kinopoisk.dev/v1.4/movie', {
          params: {
            'genres.name': response.data.genres?.[0]?.name || '',
            limit: 4,
            notId: id,
            selectFields: ['id', 'name', 'poster']
          },
          headers: {
            'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY
          }
        });

        setSimilarMovies(similarResponse.data.docs);
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Не удалось загрузить информацию о фильме');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleFavoriteClick = () => {
    if (!movie) return;

    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: id });
    } else {
      dispatch({
        type: 'ADD_FAVORITE',
        payload: {
          id: movie.id,
          title: movie.name,
          year: movie.year,
          rating: movie.rating?.imdb || 0,
          genre: movie.genres?.[0]?.name || 'Неизвестно',
          poster: movie.poster?.url || 'https://via.placeholder.com/300x450'
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Link
          to="/"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 mb-6 text-yellow-500 hover:text-yellow-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Назад к списку
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/3 lg:w-1/4">
          <div className="relative">
            <img
              src={movie.poster?.url || 'https://via.placeholder.com/300x450'}
              alt={movie.name}
              className="w-full rounded-lg shadow-xl"
            />
            <button
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 p-2 bg-gray-900/80 rounded-full hover:bg-gray-800"
            >
              {isFavorite ? (
                <HeartSolid className="h-8 w-8 text-red-500" />
              ) : (
                <HeartOutline className="h-8 w-8 text-white" />
              )}
            </button>
          </div>
        </div>

        <div className="md:w-2/3 lg:w-3/4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">{movie.name} ({movie.year})</h1>
            <div className="flex items-center gap-4">
              <span className="bg-yellow-500 text-black px-4 py-1 rounded-full font-bold text-lg">
                {movie.rating?.imdb?.toFixed(1) || 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres?.map(genre => (
              <span key={genre.name} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Описание</h2>
            <p className="text-gray-300">{movie.description || 'Описание отсутствует'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-400 mb-2">Информация</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-400">Страна:</span> {movie.countries?.map(c => c.name).join(', ') || 'Неизвестно'}</li>
                <li><span className="text-gray-400">Режиссер:</span> {movie.persons?.find(p => p.enProfession === 'director')?.name || 'Неизвестно'}</li>
                <li><span className="text-gray-400">Продолжительность:</span> {movie.movieLength || 'Неизвестно'} мин</li>
                <li><span className="text-gray-400">Возрастной рейтинг:</span> {movie.ageRating || 'Неизвестно'}+</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-400 mb-2">Актеры</h3>
              <ul className="space-y-2">
                {movie.persons?.filter(p => p.enProfession === 'actor').slice(0, 5).map(actor => (
                  <li key={actor.id}>{actor.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {similarMovies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Похожие фильмы</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {similarMovies.map(movie => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="group"
              >
                <div className="bg-gray-800 rounded-lg overflow-hidden transition transform group-hover:scale-105">
                  <img
                    src={movie.poster?.url || 'https://via.placeholder.com/300x450'}
                    alt={movie.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium truncate">{movie.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}