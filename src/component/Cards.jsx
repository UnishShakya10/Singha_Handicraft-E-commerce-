import { Link } from "react-router";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/api";

const Cards = ({ product, onDelete }) => {
  const { addItem } = useCart();
  const { isSaved, toggleItem } = useWishlist();
  const liked = isSaved(product.id);

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product);
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleItem(product);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm(`Delete ${product.title}?`)) await onDelete(product.id);
  };

  return (
    <Card
      component={Link}
      to={`/shop/${product.id}`}
      p={0}
      radius="md"
      withBorder
      bg="white"
      style={{
        overflow: "hidden",
        borderColor: "rgba(11, 11, 11, 0.08)",
        boxShadow: "0 12px 28px rgba(17, 17, 17, 0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        textDecoration: "none",
      }}
      className="product-card"
    >
      <div style={{ position: "relative" }}>
        <Image src={product.image} alt={product.title} h={260} fit="cover" />

        <Badge
          pos="absolute"
          top={14}
          left={14}
          color="gold"
          c="black"
          fw={700}
          tt="uppercase"
          variant="light"
        >
          {product.category || "Sacred piece"}
        </Badge>

        <ActionIcon
          pos="absolute"
          top={12}
          right={12}
          radius="xl"
          aria-label="Save item"
          variant={liked ? "filled" : "white"}
          color={liked ? "gold" : "gray"}
          onClick={handleWishlist}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </ActionIcon>

        {onDelete && (
          <ActionIcon
            pos="absolute"
            top={56}
            right={12}
            radius="xl"
            aria-label="Delete product"
            variant="white"
            color="red"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </ActionIcon>
        )}
      </div>

      <Stack gap={10} p="md">
        <Title order={3} c="dark" lineClamp={2} lh={1.2} fz={22}>
          {product.title}
        </Title>

        <Group justify="space-between" align="flex-end" mt={4}>
          <Stack gap={2}>
            <Text size="xs" tt="uppercase" c="dimmed" lts={1.2}>
              Price
            </Text>
            <Text fw={700} fz="lg" c="dark">
              {formatPrice(product.price)}
            </Text>
          </Stack>

          <Button
            color="gold"
            c="black"
            radius="md"
            leftSection={<ShoppingBag size={16} />}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default Cards;
