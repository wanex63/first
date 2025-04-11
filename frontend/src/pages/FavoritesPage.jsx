import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import axios from 'axios';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favoriteIds.length === 0) {
          setFavorites([]);
          return;
        }

        const response = await axios.get('https://api.kinopoisk.dev/v1.4/movie', {
          params: {
            id: favoriteIds.join(','),
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

        setFavorites(formattedMovies);
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Не удалось загрузить избранные фильмы');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

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
        <button
          onClick={() => window.location.reload()}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          Обновить страницу
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-500 mb-8">Мои избранные фильмы</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          У вас пока нет избранных фильмов
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}