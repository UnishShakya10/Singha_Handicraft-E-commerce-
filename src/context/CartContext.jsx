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
    (product, quantity = 1) => {
      const stock = Number(product.stock || 0);
      const existing = items.find((item) => item.id === product.id);
      const requestedQuantity = (existing?.quantity || 0) + Number(quantity);

      if (!Number.isSafeInteger(Number(quantity)) || Number(quantity) < 1) {
        return { ok: false, message: "Choose a valid quantity." };
      }
      if (stock < 1) {
        return { ok: false, message: "This item is out of stock." };
      }
      if (requestedQuantity > stock) {
        return {
          ok: false,
          message: `Only ${stock} available. Your cart already contains ${existing?.quantity || 0}.`,
        };
      }

      const next = existing
        ? items.map((item) =>
            item.id === product.id
              ? { ...item, ...product, quantity: requestedQuantity }
              : item
          )
        : [...items, { ...product, quantity: Number(quantity) }];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setItems(next);
      return { ok: true };
    },
    [items]
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
    (id, quantity, availableStock) => {
      if (quantity < 1) {
        const next = items.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setItems(next);
        return { ok: true };
      }

      if (!Number.isSafeInteger(quantity)) {
        return { ok: false, message: "Choose a whole-number quantity." };
      }

      const currentItem = items.find((item) => item.id === id);
      const stock = Number(availableStock ?? currentItem?.stock ?? 0);
      if (quantity > stock && quantity > Number(currentItem?.quantity || 0)) {
        return {
          ok: false,
          message: stock > 0
            ? `Only ${stock} available. Reduce the quantity to continue.`
            : "This item is out of stock. Remove it from your cart to continue.",
        };
      }

      const next = items.map((item) =>
        item.id === id ? { ...item, stock, quantity } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setItems(next);
      return { ok: true };
    },
    [items]
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
