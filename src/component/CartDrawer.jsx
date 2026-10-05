import { Link } from "react-router";
import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../lib/api";

const CartDrawer = ({ opened, onClose }) => {
  const { items: cartItems, removeItem, setQuantity, clear } = useCart();
  const { products } = useProducts();
  const items = cartItems.filter((item) => (
    products.some((product) => product.id === item.id && product.isActive !== false)
  ));
  const subtotal = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={
        <Group gap="xs">
          <ShoppingBag size={18} color="#c9a227" />
          <Title order={3}>Your selection</Title>
        </Group>
      }
    >
      <Stack h="calc(100vh - 140px)" justify="space-between">
        <ScrollArea flex={1}>
          {items.length === 0 ? (
            <Stack align="center" py="xl" gap="md">
              <Text c="dimmed">Your cart is empty.</Text>
              <Button
                component={Link}
                to="/shop"
                color="gold"
                c="black"
                onClick={onClose}
              >
                Browse collection
              </Button>
            </Stack>
          ) : (
            <Stack gap="md">
              {items.map((item) => (
                <Group key={item.id} align="flex-start" wrap="nowrap">
                  <Image src={item.image} alt={item.title} w={80} h={80} radius="sm" />
                  <Stack gap={6} flex={1}>
                    <Text fw={500} lh={1.3}>
                      {item.title}
                    </Text>
                    <Text c="gold.6" size="sm">
                      {formatPrice(item.price)}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="default"
                        size="sm"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </ActionIcon>
                      <Text size="sm" w={20} ta="center">
                        {item.quantity}
                      </Text>
                      <ActionIcon
                        variant="default"
                        size="sm"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </ActionIcon>
                      <Button
                        variant="subtle"
                        color="red"
                        size="compact-xs"
                        ml="auto"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </Group>
                  </Stack>
                </Group>
              ))}
            </Stack>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <Stack gap="sm">
            <Divider />
            <Group justify="space-between">
              <Text c="dimmed" size="sm">
                Subtotal
              </Text>
              <Text fw={600}>{formatPrice(subtotal)}</Text>
            </Group>
            <Text size="xs" c="dimmed">
              Shipping and temple delivery are arranged after enquiry.
            </Text>
            <Button component={Link} to="/cart" color="dark" fullWidth onClick={onClose}>
              Request invoice
            </Button>
            <Button variant="subtle" color="gray" size="compact-sm" onClick={clear}>
              Clear cart
            </Button>
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
};

export default CartDrawer;
