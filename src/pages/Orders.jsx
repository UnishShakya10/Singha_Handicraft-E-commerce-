import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Button,
  Badge,
  Container,
  Divider,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Eye, XCircle } from "lucide-react";
import { api, formatPrice } from "../lib/api";

const normalizeOrderStatus = (status) =>
  ({
    placed: "pending",
    processing: "confirmed",
    shipped: "confirmed",
  })[status] ||
  status ||
  "pending";

const getStatusColor = (status) => {
  const colors = {
    pending: "yellow",
    confirmed: "blue",
    delivered: "green",
    cancelled: "red",
  };
  return colors[normalizeOrderStatus(status)] || "gray";
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setMessage("");
      const { data } = await api.patch(`/orders/${orderToCancel._id}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o._id === data._id ? { ...o, ...data } : o))
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not cancel the order.");
    } finally {
      setCancelling(false);
      setOrderToCancel(null);
    }
  };

  return (
    <Container size="md" py={64}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <Title order={1}>Your orders</Title>
          {!loading && orders.length > 0 && (
            <Text c="dimmed" size="sm">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </Text>
          )}
        </Group>

        {loading && <Text c="dimmed">Loading orders...</Text>}

        {!loading && message && <Text c="red">{message}</Text>}

        {!loading && !message && orders.length === 0 && (
          <Paper withBorder radius="md" p="xl" ta="center">
            <Text c="dimmed">You have no orders yet.</Text>
          </Paper>
        )}

        {orders.map((order) => (
          <Paper key={order._id} withBorder radius="md" p="lg" shadow="xs">
            <Stack gap="md">
              {/* Header */}
              <Group justify="space-between" wrap="nowrap">
                <Text fw={600} size="lg">
                  {order.invoiceNumber || `Order ${order._id.slice(-8)}`}
                </Text>
                <Badge
                  color={getStatusColor(order.status)}
                  variant="light"
                  size="lg"
                  tt="capitalize"
                >
                  {normalizeOrderStatus(order.status)}
                </Badge>
              </Group>

              <Divider />

              {/* Details */}
              <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
                <Stack gap={2}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Date
                  </Text>
                  <Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
                </Stack>

                <Stack gap={2}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Items
                  </Text>
                  <Text>{order.items?.length || 0}</Text>
                </Stack>

                <Stack gap={2}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Total
                  </Text>
                  <Text fw={600}>
                    {formatPrice(order.subtotal ?? order.totalAmount)}
                  </Text>
                </Stack>
              </SimpleGrid>

              {/* Footer */}
              <Group justify="flex-end">
                {normalizeOrderStatus(order.status) === "pending" && (
                  <Button
                    variant="light"
                    color="red"
                    leftSection={<XCircle size={16} />}
                    onClick={() => setOrderToCancel(order)}
                  >
                    Cancel order
                  </Button>
                )}
                <Button
                  component={Link}
                  to={`/invoice/${encodeURIComponent(order._id)}`}
                  variant="default"
                  color="dark"
                  leftSection={<Eye size={16} />}
                >
                  View invoice
                </Button>
              </Group>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Cancel confirmation */}
      <Modal
        opened={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        title="Cancel order?"
        centered
      >
        <Text size="sm">
          {orderToCancel?.invoiceNumber || "This order"} will be cancelled.
          This can't be undone.
        </Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={() => setOrderToCancel(null)}>
            Keep order
          </Button>
          <Button color="red" loading={cancelling} onClick={handleCancel}>
            Yes, cancel
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default Orders;