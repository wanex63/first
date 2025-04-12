import { Link } from 'react-router-dom';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

export default function MovieCard({ movie }) {
  const getPosterUrl = () => {
    if (movie.posterUrl) return movie.posterUrl;
    if (movie.poster?.url) return movie.poster.url;
    if (movie.poster?.previewUrl) return movie.poster.previewUrl;
    if (movie.id) return `https://st.kp.yandex.net/images/film_iphone/iphone360_${movie.id}.jpg`;
    return 'https://via.placeholder.com/300x450?text=No+poster';
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group block h-full">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 hover:shadow-xl h-full flex flex-col">
        <div className="relative flex-shrink-0">
          <img
            src={getPosterUrl()}
            alt={movie.title || 'Movie poster'}
            className="w-full h-64 object-cover transition-all duration-300 group-hover:opacity-90"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=Poster+error';
            }}
          />
          <button
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
            onClick={(e) => e.preventDefault()}
          >
            <HeartOutline className="h-5 w-5 text-white group-hover:text-yellow-500" />
          </button>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-yellow-500 font-bold">{movie.rating?.toFixed(1) || 'N/A'}</span>
            <span className="text-gray-400">{movie.year}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1 truncate">
            {movie.genres?.[0] || 'Жанр не указан'}
          </p>
        </div>
      </div>
    </Link>
  );
}