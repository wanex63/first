import { Link } from 'react-router-dom'
import { Movie } from '../types' // Типы создадим на следующем шаге

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition-all">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold truncate">{movie.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-yellow-400">⭐ {movie.rating}</span>
          <span className="text-gray-400">{movie.year}</span>
        </div>
        <Link
          to={`/movie/${movie.id}`}
          className="mt-4 inline-block w-full bg-yellow-500 hover:bg-yellow-600 text-black text-center py-2 px-4 rounded transition"
        >
          Подробнее
        </Link>
      </div>
    </div>
  )
}