import { Link } from 'react-router-dom';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion'; // Импортируем motion

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <motion.div
        className="bg-kino-gray rounded-lg overflow-hidden shadow-lg"
        whileHover={{ scale: 1.05 }} // Анимация при наведении (увеличение)
        transition={{ duration: 0.3 }} // Плавное увеличение
      >
        <div className="relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450';
            }}
          />
          <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-200">
            <HeartOutline className="h-5 w-5 text-white group-hover:text-kino-yellow transition-colors duration-200" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-kino-yellow font-bold">
              {movie.rating?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-gray-400">{movie.year}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1 truncate">{movie.genre}</p>
        </div>
      </motion.div>
    </Link>
  );
}

