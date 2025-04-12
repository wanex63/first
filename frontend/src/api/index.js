import axios from 'axios';

const kinoApi = axios.create({
  baseURL: 'https://api.kinopoisk.dev/v1.4/',
  headers: {
    'X-API-KEY': import.meta.env.VITE_KINOPOISK_API_KEY
  }
});

const localApi = axios.create({
  baseURL: 'http://localhost:8000/api/', // URL твоего Django API
});

export const getMovies = async (source = 'kinopoisk') => {
  try {
    const api = source === 'local' ? localApi : kinoApi;

    const response = await api.get('movie', {
      params: source === 'kinopoisk'
        ? {
            lists: 'top250',
            limit: 10,
            selectFields: ['id', 'name', 'year', 'rating', 'poster', 'genres']
          }
        : {}
    });

    const data = source === 'kinopoisk' ? response.data.docs : response.data;

    return data.map(movie => ({
      id: movie.id,
      title: movie.name,
      year: movie.year,
      rating: movie.rating?.imdb || movie.rating || 0,
      genre: movie.genres?.[0]?.name || movie.genre || 'Неизвестно',
      poster: movie.poster?.url || movie.poster || 'https://via.placeholder.com/300x450'
    }));
  } catch (error) {
    console.error('Ошибка при загрузке фильмов:', error);
    throw error;
  }
};
