import { useEffect, useState } from "react";
import {
  Badge,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { api, formatPrice } from "../lib/api";

// 👇 PUT THIS HERE
const getStatusColor = (status) => {
  const colors = {
    placed: "gray",
    processing: "orange",
    shipped: "blue",
    delivered: "green",
    cancelled: "red",
  };

  return colors[status] || "gray";
};

// 👇 YOUR COMPONENT STARTS HERE
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <Container size="md" py={64}>
      <Stack gap="lg">
        <Title order={1}>Your orders</Title>

        {loading && <Text c="dimmed">Loading orders...</Text>}

        {!loading && message && <Text c="red">{message}</Text>}

        {!loading && !message && orders.length === 0 && (
          <Text c="dimmed">You have no orders yet.</Text>
        )}

        {orders.map((order) => (
          <Stack key={order._id} gap="sm" py="md">
            <Group justify="space-between">
              <Text fw={600}>Order {order._id.slice(-8)}</Text>

              {/* 👇 CHANGE YOUR BADGE TO THIS */}
              <Badge color={getStatusColor(order.status)} tt="capitalize">
                {order.status}
              </Badge>
            </Group>

            <Text size="sm" c="dimmed">
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>

            <Text>{order.items?.length || 0} items</Text>

            <Group justify="space-between">
              <Text c="dimmed">Total</Text>
              <Text fw={600}>{formatPrice(order.totalAmount)}</Text>
            </Group>

            <Divider />
          </Stack>
        ))}
      </Stack>
    </Container>
  );
};

export default Orders;