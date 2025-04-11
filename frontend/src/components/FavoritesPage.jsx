import { useSelector } from 'react-redux';
import MovieCard from '../components/MovieCard';
import { HeartIcon } from '@heroicons/react/24/solid';

export default function FavoritesPage() {
  const favorites = useSelector(state => state.movies.favorites);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <HeartIcon className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold text-yellow-500">Избранное</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <HeartIcon className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Нет избранных фильмов</h3>
          <p className="text-gray-500">Добавляйте фильмы, нажимая на сердечко</p>
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