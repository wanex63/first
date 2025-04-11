import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.kinopoisk.dev/v1.4/',
  headers: {
    'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY
  }
});

export const getTopMovies = async () => {
  try {
    const response = await api.get('movie', {
      params: {
        lists: 'top250',
        limit: 5,
        selectFields: ['id', 'name', 'year', 'rating', 'poster', 'genres']
      }
    });
    return response.data.docs.map(movie => ({
      id: movie.id,
      title: movie.name,
      year: movie.year,
      rating: movie.rating?.imdb || 0,
      genre: movie.genres?.[0]?.name || 'Неизвестно',
      poster: movie.poster?.url || 'https://via.placeholder.com/300x450'
    }));
  } catch (error) {
    console.error('Ошибка при загрузке фильмов:', error);
    return [];
  }
};