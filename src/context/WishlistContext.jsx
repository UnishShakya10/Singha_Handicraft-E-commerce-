/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "singha-wishlist";

const readWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(readWishlist);

  const toggleItem = useCallback((product) => {
    setItems((currentItems) => {
      const exists = currentItems.some((item) => item.id === product.id);
      const next = exists
        ? currentItems.filter((item) => item.id !== product.id)
        : [...currentItems, { ...product }];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((currentItems) => {
      const next = currentItems.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id) => items.some((item) => item.id === id),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      toggleItem,
      removeItem,
      isSaved,
      count: items.length,
    }),
    [items, toggleItem, removeItem, isSaved]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
