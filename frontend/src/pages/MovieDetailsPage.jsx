import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
          headers: {
            'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY
          }
        });

        setMovie({
          id: response.data.id,
          title: response.data.name,
          year: response.data.year,
          rating: response.data.rating?.imdb || 0,
          genres: response.data.genres?.map(g => g.name) || [],
          description: response.data.description || 'Описание отсутствует',
          poster: response.data.poster?.url || 'https://via.placeholder.com/500x750',
          countries: response.data.countries?.map(c => c.name) || [],
          length: response.data.movieLength || 'Неизвестно'
        });
      } catch (err) {
        console.error('Ошибка при загрузке фильма:', err);
        setError('Не удалось загрузить информацию о фильме');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return <ErrorMessage message="Фильм не найден" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-block mb-6 text-yellow-500 hover:text-yellow-400 transition"
      >
        ← Назад к списку
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full rounded-lg shadow-xl"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
            }}
          />
        </div>

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">{movie.title} ({movie.year})</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
              ⭐ {movie.rating.toFixed(1)}
            </span>
            <span>{movie.length} мин</span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">О фильме</h2>
            <p className="text-gray-300">{movie.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold">Жанры</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.genres.map(genre => (
                  <span key={genre} className="bg-gray-700 px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Страны</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.countries.map(country => (
                  <span key={country} className="bg-gray-700 px-3 py-1 rounded-full">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}