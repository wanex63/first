import { Link } from 'react-router-dom';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="bg-kinopoisk-gray rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
        <div className="relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450';
            }}
          />
          <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70">
            <HeartOutline className="h-5 w-5 text-white group-hover:text-kinopoisk-yellow" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-kinopoisk-yellow font-bold">
              {movie.rating?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-gray-400">{movie.year}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1 truncate">{movie.genre}</p>
        </div>
      </div>
    </Link>
  );
}