import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Alert,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { ArrowLeft, Eye, MessageCircle, XCircle } from "lucide-react";
import { useMyOrders } from "../hooks/useMyOrders";
import { formatPrice } from "../lib/api";
import {
  FALLBACK_IMAGE,
  STATUS_COLORS,
  STATUS_STEPS,
  formatDate,
} from "../lib/orders";

const WHATSAPP_NUMBER = "9779861616232";

const Row = ({ label, value, bold }) => (
  <Group justify="space-between">
    <Text size="sm" c="dimmed">
      {label}
    </Text>
    <Text size="sm" fw={bold ? 700 : 500}>
      {value}
    </Text>
  </Group>
);

const OrderDetail = () => {
  const { id } = useParams();
  const { orders, loading, error, cancelOrder } = useMyOrders();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const order = orders.find((o) => o.id === String(id));

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setCancelError("");
      await cancelOrder(order.id);
    } catch (err) {
      setCancelError(err.response?.data?.message || "Could not cancel the order.");
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  if (loading) {
    return (
      <Group justify="center" py={120}>
        <Loader color="gold" />
      </Group>
    );
  }

  if (error || !order) {
    return (
      <Container size="sm" py={120}>
        <Stack align="center" ta="center">
          <Title order={2}>Order not found</Title>
          <Text c="dimmed">{error || "We couldn't find that order."}</Text>
          <Button component={Link} to="/profile" color="dark">
            Back to profile
          </Button>
        </Stack>
      </Container>
    );
  }

  const cancelled = order.status === "cancelled";
  const activeStep = Math.max(STATUS_STEPS.indexOf(order.status), 0);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello, I have a question about ${order.label}`
  )}`;

  return (
    <Container size="md" py={48}>
      <Stack gap="lg">
        <Button
          component={Link}
          to="/profile"
          variant="subtle"
          color="dark"
          leftSection={<ArrowLeft size={16} />}
          px={0}
          w="fit-content"
        >
          Back to profile
        </Button>

        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>{order.label}</Title>
            <Text c="dimmed" size="sm">
              Placed {formatDate(order.createdAt)}
            </Text>
          </div>
          <Badge
            size="lg"
            color={STATUS_COLORS[order.status] || "gray"}
            variant="light"
            tt="capitalize"
          >
            {order.status}
          </Badge>
        </Group>

        {cancelError && <Alert color="red">{cancelError}</Alert>}

        {!cancelled && (
          <Paper withBorder radius="md" p="lg">
            <Stepper active={activeStep} size="sm" color="gold">
              <Stepper.Step label="Placed" />
              <Stepper.Step label="Confirmed" />
              <Stepper.Step label="Delivered" />
            </Stepper>
          </Paper>
        )}

        <Paper withBorder radius="md">
          <Stack gap={0}>
            {order.items.map((item, index) => (
              <Group
                key={item.key}
                wrap="nowrap"
                p="md"
                style={{
                  borderTop:
                    index === 0 ? "none" : "1px solid var(--mantine-color-gray-2)",
                }}
              >
                <Image
                  src={item.image || FALLBACK_IMAGE}
                  fallbackSrc={FALLBACK_IMAGE}
                  alt={item.title}
                  w={88}
                  h={88}
                  radius="sm"
                  fit="cover"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={600}>{item.title}</Text>
                  {item.finish && (
                    <Text size="sm" c="dimmed">
                      Finish: {item.finish}
                    </Text>
                  )}
                  <Text size="sm" c="dimmed">
                    {formatPrice(item.price)} × {item.quantity}
                  </Text>
                </div>
                <Text fw={600}>{formatPrice(item.price * item.quantity)}</Text>
              </Group>
            ))}
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <Paper withBorder radius="md" p="lg">
            <Title order={5} mb="sm">
              Order summary
            </Title>
            <Stack gap="xs">
              <Row label="Items" value={order.items.length} />
              <Divider />
              <Row label="Total" value={formatPrice(order.total)} bold />
            </Stack>
          </Paper>

          {(order.address || order.phone || order.paymentMethod) && (
            <Paper withBorder radius="md" p="lg">
              <Title order={5} mb="sm">
                Delivery
              </Title>
              <Stack gap="xs">
                {order.address && <Text size="sm">{order.address}</Text>}
                {order.phone && (
                  <Text size="sm" c="dimmed">
                    Phone: {order.phone}
                  </Text>
                )}
                {order.paymentMethod && (
                  <Text size="sm" c="dimmed" tt="capitalize">
                    Payment: {order.paymentMethod}
                  </Text>
                )}
              </Stack>
            </Paper>
          )}
        </SimpleGrid>

        <Group>
          <Button
            component={Link}
            to={`/invoice/${encodeURIComponent(order.id)}`}
            variant="default"
            color="dark"
            leftSection={<Eye size={16} />}
          >
            View invoice
          </Button>
          <Button
            component="a"
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            color="dark"
            leftSection={<MessageCircle size={18} />}
          >
            Ask about this order
          </Button>
          {order.status === "pending" && (
            <Button
              variant="light"
              color="red"
              leftSection={<XCircle size={16} />}
              onClick={() => setConfirmCancel(true)}
            >
              Cancel order
            </Button>
          )}
        </Group>
      </Stack>

      <Modal
        opened={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel order?"
        centered
      >
        <Text size="sm">{order.label} will be cancelled. This can't be undone.</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={() => setConfirmCancel(false)}>
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

export default OrderDetail;