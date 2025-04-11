import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  favorites: JSON.parse(localStorage.getItem('favoriteMovies')) || [],
};

function movieReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FAVORITE':
      const newFavoritesAdd = [...state.favorites, action.payload];
      localStorage.setItem('favoriteMovies', JSON.stringify(newFavoritesAdd));
      return { ...state, favorites: newFavoritesAdd };

    case 'REMOVE_FAVORITE':
      const newFavoritesRemove = state.favorites.filter(m => m.id !== action.payload);
      localStorage.setItem('favoriteMovies', JSON.stringify(newFavoritesRemove));
      return { ...state, favorites: newFavoritesRemove };

    default:
      return state;
  }
}

export const store = configureStore({
  reducer: {
    movies: movieReducer,
  },
});