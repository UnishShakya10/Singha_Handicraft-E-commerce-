import { Link } from "react-router";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Container,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useMyOrders } from "../hooks/useMyOrders";
import { formatPrice } from "../lib/api";
import {
  FALLBACK_IMAGE,
  STATUS_COLORS,
  formatDate,
} from "../lib/orders";

const OrderCard = ({ order }) => (
  <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
    <Group
      justify="space-between"
      p="md"
      style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
    >
      <div>
        <Text fw={600}>{order.label}</Text>
        <Text size="xs" c="dimmed">
          Placed {formatDate(order.createdAt)}
        </Text>
      </div>
      <Badge
        color={STATUS_COLORS[order.status] || "gray"}
        variant="light"
        tt="capitalize"
      >
        {order.status}
      </Badge>
    </Group>

    <Stack gap={0}>
      {order.items.map((item) => (
        <Group
          key={item.key}
          wrap="nowrap"
          p="md"
          style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
        >
          <Image
            src={item.image || FALLBACK_IMAGE}
            fallbackSrc={FALLBACK_IMAGE}
            alt={item.title}
            w={60}
            h={60}
            radius="sm"
            fit="cover"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} size="sm" truncate>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.finish ? `Finish: ${item.finish} · ` : ""}Qty {item.quantity}
            </Text>
          </div>
          <Text fw={600} size="sm">
            {formatPrice(item.price * item.quantity)}
          </Text>
        </Group>
      ))}
    </Stack>

    <Group justify="space-between" p="md" bg="gray.0">
      <div>
        <Text size="xs" c="dimmed">
          Total
        </Text>
        <Text fw={700} size="lg">
          {formatPrice(order.total)}
        </Text>
      </div>
      <Button component={Link} to={`/orders/${order.id}`} color="dark">
        View order
      </Button>
    </Group>
  </Paper>
);

const Profile = () => {
  const { user, avatarSrc } = useAuth();
  const { orders, loading, error } = useMyOrders();

  return (
    <Container size="md" py={64}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Group>
            <Avatar src={avatarSrc || undefined} size={72} radius="xl" color="gold" />
            <div>
              <Title order={2}>Welcome, {user?.fullName}</Title>
              <Text c="dimmed">{user?.email}</Text>
            </div>
          </Group>
          <Text size="sm" tt="capitalize" c="dimmed">
            {user?.role}
          </Text>
        </Group>

        <Group justify="space-between" align="baseline">
          <Title order={3}>Your orders</Title>
          <Button component={Link} to="/cart" variant="default" size="xs">
            View cart
          </Button>
        </Group>

        {loading && (
          <Group justify="center" py="xl">
            <Loader color="gold" />
          </Group>
        )}

        {!loading && error && <Alert color="red">{error}</Alert>}

        {!loading && !error && orders.length === 0 && (
          <Paper withBorder radius="md" p="xl" ta="center">
            <Title order={4}>Start your first order</Title>
            <Text c="dimmed" size="sm" mt={4}>
              Orders you place will show up here.
            </Text>
            <Button component={Link} to="/shop" color="dark" mt="md">
              Browse the shop
            </Button>
          </Paper>
        )}

        {!loading &&
          !error &&
          orders.map((order) => <OrderCard key={order.id} order={order} />)}
      </Stack>
    </Container>
  );
};

export default Profile;