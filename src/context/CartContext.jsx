/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "singha-cart";

const readCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readCart);

  const addItem = useCallback(
    (product) => {
      setItems((currentItems) => {
        const existing = currentItems.find((item) => item.id === product.id);
        const next = existing
          ? currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...currentItems, { ...product, quantity: 1 }];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const removeItem = useCallback(
    (id) => {
      setItems((currentItems) => {
        const next = currentItems.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const setQuantity = useCallback(
    (id, quantity) => {
      setItems((currentItems) => {
        if (quantity < 1) {
          const next = currentItems.filter((item) => item.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        }

        const next = currentItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const clear = useCallback(() => {
    setItems([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }, []);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, clear, count, subtotal }),
    [items, addItem, removeItem, setQuantity, clear, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
