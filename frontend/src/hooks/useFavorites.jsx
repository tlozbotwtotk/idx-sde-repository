import { useState, useEffect } from "react";

const FAVORITES_KEY = "savedPropertyFavorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }, [favorites]);

  const isFavorite = (propertyId) => {
    return favorites.some((fav) => fav.L_ListingID === propertyId);
  };

  const toggleFavorite = (property) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((fav) => fav.L_ListingID === property.L_ListingID);
      if (exists) {
        return prevFavorites.filter((fav) => fav.L_ListingID !== property.L_ListingID);
      } else {
        return [...prevFavorites, property];
      }
    });
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length,
  };
}