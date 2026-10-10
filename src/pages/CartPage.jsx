import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ActionIcon, Alert, Button, Container, Group, Image, SimpleGrid, Stack, Text, TextInput, Textarea, Title } from "@mantine/core";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { api, formatPrice } from "../lib/api";
import { useProducts } from "../context/ProductContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { items: cartItems, setQuantity, removeItem, clear } = useCart();
  const { products } = useProducts();
  const items = cartItems.filter((item) => (
    products.some((product) => product.id === item.id && product.isActive !== false)
  ));
  const subtotal = items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateAddress = (field, value) => {
    setShippingAddress((current) => ({ ...current, [field]: value }));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod: "cod",
      });
      const order = data?.order || data;
      if (!order?._id) {
        throw new Error(
          "The order was placed, but the server did not return its ID. Please contact us before placing another order."
        );
      }

      clear();
      navigate(`/invoice/${encodeURIComponent(order._id)}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Your order could not be placed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container size="md" py={64}>
      <Stack gap="lg">
        <Title order={1}>Your cart</Title>
        {message && <Alert color="red">{message}</Alert>}
        {items.length === 0 ? (
          <Stack align="flex-start" gap="md">
            <Text c="dimmed">Your cart is empty.</Text>
            <Button component={Link} to="/shop" color="dark">Browse collection</Button>
          </Stack>
        ) : (
          <>
            {items.map((item) => (
              <Group key={item.id} justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <Image src={item.image} alt={item.title} w={72} h={72} radius="sm" />
                  <Stack gap={4}>
                    <Text fw={600}>{item.title}</Text>
                    <Text c="dimmed" size="sm">{formatPrice(item.price)}</Text>
                  </Stack>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <ActionIcon variant="default" aria-label="Decrease quantity" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                    <Minus size={15} />
                  </ActionIcon>
                  <Text w={24} ta="center">{item.quantity}</Text>
                  <ActionIcon variant="default" aria-label="Increase quantity" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                    <Plus size={15} />
                  </ActionIcon>
                  <Button variant="subtle" color="red" size="compact-sm" onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </Group>
              </Group>
            ))}
            <Group justify="space-between">
              <Text fw={600}>Subtotal</Text>
              <Text fw={700}>{formatPrice(subtotal)}</Text>
            </Group>
            <form onSubmit={handleCheckout}>
              <Stack gap="md" mt="md">
                <div>
                  <Title order={3}>Delivery details</Title>
                  <Text size="sm" c="dimmed" mt={4}>We will contact you to confirm the order and delivery.</Text>
                </div>
                <TextInput
                  label="Full name"
                  autoComplete="name"
                  required
                  value={shippingAddress.fullName}
                  onChange={(event) => updateAddress("fullName", event.currentTarget.value)}
                />
                <TextInput
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(event) => updateAddress("phone", event.currentTarget.value)}
                />
                <Textarea
                  label="Street address"
                  autoComplete="street-address"
                  required
                  value={shippingAddress.address}
                  onChange={(event) => updateAddress("address", event.currentTarget.value)}
                />
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                  <TextInput label="City" autoComplete="address-level2" required value={shippingAddress.city} onChange={(event) => updateAddress("city", event.currentTarget.value)} />
                  <TextInput label="State / Province" autoComplete="address-level1" required value={shippingAddress.state} onChange={(event) => updateAddress("state", event.currentTarget.value)} />
                  <TextInput label="Postal code (optional)" autoComplete="postal-code" value={shippingAddress.postalCode} onChange={(event) => updateAddress("postalCode", event.currentTarget.value)} />
                </SimpleGrid>
                <Button type="submit" color="dark" loading={submitting}>
                  Place order · {formatPrice(subtotal)}
                </Button>
                <Button type="button" variant="subtle" color="gray" onClick={clear} w="fit-content">
                  Clear cart
                </Button>
              </Stack>
            </form>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default CartPage;