import { Link } from "react-router";
import {
  ActionIcon,
  Affix,
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
import { ArrowLeft, ArrowRight, Heart, Trash2 } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../lib/api";

const WishlistDrawer = () => {
  const [opened, { close, toggle }] = useDisclosure(false);
  const { items: savedItems, removeItem } = useWishlist();
  const { products } = useProducts();
  const items = savedItems.filter((item) => (
    products.some((product) => product.id === item.id && product.isActive !== false)
  ));
  const count = items.length;

  return (
    <>
      <Affix position={{ top: "45%", right: 0 }} zIndex={200}>
        <Button
          aria-label={opened ? "Close wishlist" : "Open wishlist"}
          onClick={toggle}
          color="dark"
          c="white"
          px={10}
          radius="sm 0 0 sm"
          style={{
            height: 132,
            writingMode: "vertical-rl",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "-4px 8px 20px rgba(0, 0, 0, 0.28)",
          }}
        >
          {opened ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
          <Text span fw={700} size="xs" lts={1.5} mt={6}>
            WISHLIST{count > 0 ? ` ${count}` : ""}
          </Text>
        </Button>
      </Affix>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="md"
        transitionProps={{ transition: "slide-left", duration: 280 }}
        title={
          <Group gap="xs">
            <Heart size={18} color="#c9a227" />
            <Title order={3}>Saved pieces</Title>
          </Group>
        }
      >
        <Stack h="calc(100vh - 140px)" justify="space-between">
          <ScrollArea flex={1}>
            {items.length === 0 ? (
              <Stack align="center" py="xl" gap="md">
                <Text c="dimmed">No saved pieces yet.</Text>
                <Button component={Link} to="/shop" color="gold" c="black" onClick={close}>
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
                        <Button component={Link} to={`/shop/${item.id}`} size="compact-sm" variant="light" color="dark" onClick={close}>
                          View
                        </Button>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          ml="auto"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={14} />
                        </ActionIcon>
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
              <Text size="xs" c="dimmed">
                Your favourites stay saved here until you remove them.
              </Text>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </>
  );
};

export default WishlistDrawer;
