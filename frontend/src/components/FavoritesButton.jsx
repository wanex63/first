import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function FavoritesButton({ movieId }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(movieId));
  }, [movieId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(id => id !== movieId);
    } else {
      updatedFavorites = [...favorites, movieId];
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full z-10"
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      {isFavorite ? (
        <FaHeart className="text-red-500 text-xl" />
      ) : (
        <FaRegHeart className="text-white text-xl hover:text-red-500" />
      )}
    </button>
  );
}