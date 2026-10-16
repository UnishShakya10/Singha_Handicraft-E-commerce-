import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useProducts } from "../context/ProductContext";
import { normalizeOrder } from "../lib/orders";

export const useMyOrders = () => {
  const { products } = useProducts();
  const [rawOrders, setRawOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await api.get("/orders/my");
        if (!cancelled) setRawOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load your orders.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cancelOrder = useCallback(async (id) => {
    const { data } = await api.patch(`/orders/${id}/cancel`);
    setRawOrders((prev) =>
      prev.map((o) => (o._id === data._id ? { ...o, ...data } : o))
    );
  }, []);

  const orders = useMemo(
    () =>
      rawOrders
        .map((order) => normalizeOrder(order, products))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [rawOrders, products]
  );

  return { orders, loading, error, cancelOrder };
};