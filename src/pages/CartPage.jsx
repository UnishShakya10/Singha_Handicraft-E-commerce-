
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ActionIcon,
  Alert,
  Button,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { api, formatPrice } from "../lib/api";
import { useProducts } from "../context/ProductContext";
import PaymentMethodSelector from "../component/PaymentMethodSelector";

// Find the selected variant in the latest product data.
const findSelectedVariant = (product, item) => {
  if (!item.selectedVariant) return null;

  const selectedId = String(item.selectedVariant.id || "");
  const selectedFinish = String(item.selectedVariant.finish || "");

  return (product?.variants || []).find((variant) => {
    const variantId = String(variant._id || variant.id || "");

    return (
      (selectedId && variantId === selectedId) ||
      (!selectedId && selectedFinish &&
        variant.finish?.toLowerCase() === selectedFinish.toLowerCase())
    );
  });
};

// Get the correct stock for the selected finish.
const getItemInventory = (product, item) => {
  if (!product || product.isActive === false) {
    return { unavailable: true, stock: 0 };
  }

  if (item.selectedVariant) {
    const variant = findSelectedVariant(product, item);

    if (!variant || variant.isActive === false) {
      return { unavailable: true, stock: 0 };
    }

    return {
      unavailable: false,
      stock: Number(variant.stock || 0),
    };
  }

  return {
    unavailable: false,
    stock: Number(product.stock || 0),
  };
};

const CartPage = () => {
  const navigate = useNavigate();

  const {
    items: cartItems,
    setQuantity,
    removeItem,
    clear,
  } = useCart();

  const { products, refreshProducts } = useProducts();

  const items = cartItems.map((item) => {
    const currentProduct = products.find(
      (product) => product.id === item.id
    );

    const inventory = getItemInventory(currentProduct, item);

    return {
      ...item,
      currentProduct,
      unavailable: inventory.unavailable,
      stock: inventory.stock,
      finish: item.selectedVariant?.finish || "Gold",
    };
  });

  const stockIssues = items.filter(
    (item) => item.unavailable || item.quantity > item.stock
  );

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentReference, setPaymentReference] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateAddress = (field, value) => {
    setShippingAddress((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateCartQuantity = (item, quantity) => {
    const result = setQuantity(item.id, quantity, item.stock);
    setMessage(result.ok ? "" : result.message);
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setMessage("");

    if (items.length === 0) {
      setMessage("Your cart has no available products.");
      return;
    }

    if (stockIssues.length > 0) {
      setMessage(
        "Please resolve the stock issues in your cart before checkout."
      );
      return;
    }

    setSubmitting(true);

    try {
      const latestProducts = await refreshProducts();

      const unavailableItem = items.find((item) => {
        const latestProduct = latestProducts.find(
          (product) => product.id === item.id
        );

        const inventory = getItemInventory(latestProduct, item);

        return (
          inventory.unavailable ||
          item.quantity > inventory.stock
        );
      });

      if (unavailableItem) {
        const latestProduct = latestProducts.find(
          (product) => product.id === unavailableItem.id
        );

        const inventory = getItemInventory(
          latestProduct,
          unavailableItem
        );

        if (inventory.unavailable) {
          setMessage(
            `${unavailableItem.title} (${unavailableItem.finish}) is no longer available. Remove it from your cart.`
          );
        } else {
          setMessage(
            `Only ${inventory.stock} of ${unavailableItem.title} (${unavailableItem.finish}) are currently available. Update your cart before checkout.`
          );
        }

        return;
      }

      const { data } = await api.post("/orders", {
        items: items.map((item) => ({
          product: item.id,
          variantId: item.selectedVariant?.id || null,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        paymentReference,
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

        {stockIssues.length > 0 && (
          <Alert color="red" title="Cart quantities need attention">
            {stockIssues
              .map((item) =>
                !item.unavailable && item.stock > 0
                  ? `${item.title} (${item.finish}): only ${item.stock} currently available.`
                  : `${item.title} (${item.finish}) is no longer available. Remove it from your cart.`
              )
              .join(" ")}
          </Alert>
        )}

        {items.length === 0 ? (
          <Stack align="flex-start" gap="md">
            <Text c="dimmed">Your cart is empty.</Text>

            <Button component={Link} to="/shop" color="dark">
              Browse collection
            </Button>
          </Stack>
        ) : (
          <>
            {items.map((item) => {
              const imageSrc =
                typeof item.image === "string"
                  ? item.image
                  : item.image?.url ||
                    item.image?.secure_url ||
                    item.image?.imageUrl ||
                    "";

              return (
                <Group
                  key={item.id}
                  justify="space-between"
                  wrap="nowrap"
                >
                  <Group wrap="nowrap">
                    <Image
                      src={imageSrc}
                      alt={item.title}
                      w={72}
                      h={72}
                      radius="sm"
                    />

                    <Stack gap={4}>
                      <Text fw={600}>{item.title}</Text>

                      <Text size="sm" c="dimmed">
                        Finish: {item.finish}
                      </Text>

                      <Text c="dimmed" size="sm">
                        {formatPrice(item.price)}
                      </Text>

                      <Text
                        size="xs"
                        c={
                          item.unavailable
                            ? "red"
                            : item.stock > 0
                              ? "green.8"
                              : "red"
                        }
                      >
                        {item.unavailable
                          ? "No longer available"
                          : item.stock > 0
                            ? `${item.stock} in stock`
                            : "Out of stock"}
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap="xs" wrap="nowrap">
                    <ActionIcon
                      variant="default"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        updateCartQuantity(item, item.quantity - 1)
                      }
                    >
                      <Minus size={15} />
                    </ActionIcon>

                    <Text w={24} ta="center">
                      {item.quantity}
                    </Text>

                    <ActionIcon
                      variant="default"
                      aria-label="Increase quantity"
                      disabled={
                        item.unavailable ||
                        item.quantity >= item.stock
                      }
                      onClick={() =>
                        updateCartQuantity(item, item.quantity + 1)
                      }
                    >
                      <Plus size={15} />
                    </ActionIcon>

                    <Button
                      variant="subtle"
                      color="red"
                      size="compact-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Group>
                </Group>
              );
            })}

            <Group justify="space-between">
              <Text fw={600}>Subtotal</Text>
              <Text fw={700}>{formatPrice(subtotal)}</Text>
            </Group>

            <form onSubmit={handleCheckout}>
              <Stack gap="md" mt="md">
                <div>
                  <Title order={3}>Delivery details</Title>

                  <Text size="sm" c="dimmed" mt={4}>
                    We will contact you to confirm the order and delivery.
                  </Text>
                </div>

                <TextInput
                  label="Full name"
                  autoComplete="name"
                  required
                  value={shippingAddress.fullName}
                  onChange={(event) =>
                    updateAddress("fullName", event.currentTarget.value)
                  }
                />

                <TextInput
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(event) =>
                    updateAddress("phone", event.currentTarget.value)
                  }
                />

                <Textarea
                  label="Street address"
                  autoComplete="street-address"
                  required
                  value={shippingAddress.address}
                  onChange={(event) =>
                    updateAddress("address", event.currentTarget.value)
                  }
                />

                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                  <TextInput
                    label="City"
                    autoComplete="address-level2"
                    required
                    value={shippingAddress.city}
                    onChange={(event) =>
                      updateAddress("city", event.currentTarget.value)
                    }
                  />

                  <TextInput
                    label="State / Province"
                    autoComplete="address-level1"
                    required
                    value={shippingAddress.state}
                    onChange={(event) =>
                      updateAddress("state", event.currentTarget.value)
                    }
                  />

                  <TextInput
                    label="Postal code (optional)"
                    autoComplete="postal-code"
                    value={shippingAddress.postalCode}
                    onChange={(event) =>
                      updateAddress("postalCode", event.currentTarget.value)
                    }
                  />
                </SimpleGrid>

                <PaymentMethodSelector
                  method={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  reference={paymentReference}
                  onReferenceChange={setPaymentReference}
                />

                <Button
                  type="submit"
                  color="dark"
                  loading={submitting}
                  disabled={stockIssues.length > 0}
                >
                  Place order · {formatPrice(subtotal)}
                </Button>

                <Button
                  type="button"
                  variant="subtle"
                  color="gray"
                  onClick={clear}
                  w="fit-content"
                >
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
