import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "idx-favorites";
const FavoritesContext = createContext(null);

function getListingId(propertyOrId) {
  if (typeof propertyOrId === "string" || typeof propertyOrId === "number") {
    return String(propertyOrId);
  }

  return String(propertyOrId?.L_ListingID ?? propertyOrId?.id ?? "");
}

function readFavorites() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function normalizeFavorite(property) {
  const id = getListingId(property);
  if (!id) return null;

  return {
    ...property,
    L_ListingID: property.L_ListingID ?? id,
  };
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (propertyOrId) => {
      const id = getListingId(propertyOrId);
      if (!id) return false;
      return favorites.some((item) => getListingId(item) === id);
    },
    [favorites]
  );

  const addFavorite = useCallback((property) => {
    setFavorites((prev) => {
      const next = normalizeFavorite(property);
      if (!next) return prev;

      const id = getListingId(next);
      if (prev.some((item) => getListingId(item) === id)) {
        return prev;
      }

      return [next, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((propertyOrId) => {
    const id = getListingId(propertyOrId);
    if (!id) return;

    setFavorites((prev) => prev.filter((item) => getListingId(item) !== id));
  }, []);

  const toggleFavorite = useCallback(
    (property) => {
      const id = getListingId(property);
      if (!id) return;

      setFavorites((prev) => {
        const exists = prev.some((item) => getListingId(item) === id);
        if (exists) {
          return prev.filter((item) => getListingId(item) !== id);
        }

        const next = normalizeFavorite(property);
        return next ? [next, ...prev] : prev;
      });
    },
    []
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,
    }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside a FavoritesProvider");
  }

  return context;
}