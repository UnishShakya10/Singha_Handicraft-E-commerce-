import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Group,
  Image,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { Search } from "lucide-react";
import { formatPrice } from "../lib/api";
import { useProducts } from "../context/ProductContext";

const SearchModal = ({ opened, onClose }) => {
  const [query, setQuery] = useState("");
  const { products } = useProducts();

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const activeProducts = products.filter((item) => item.isActive !== false);
    if (!q) return activeProducts.slice(0, 6);
    return activeProducts.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        String(item.category || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      radius="md"
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
      padding="sm"
    >
      <TextInput
        placeholder="Search statues, deities, collections…"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        leftSection={<Search size={16} />}
        autoFocus
      />
      <ScrollArea.Autosize mah={360} mt="sm">
        {results.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" py="lg">
            No pieces match that search.
          </Text>
        ) : (
          <Stack gap={4}>
            {results.map((item) => (
              <UnstyledButton
                key={item.id}
                component={Link}
                to="/shop"
                onClick={onClose}
                p="sm"
                style={{ borderRadius: 8 }}
              >
                <Group>
                  <Image src={item.image} alt={item.title} w={56} h={56} radius="sm" />
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {item.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.category}
                    </Text>
                  </div>
                  <Text size="sm" fw={600} c="gold.6">
                    {formatPrice(item.price)}
                  </Text>
                </Group>
              </UnstyledButton>
            ))}
          </Stack>
        )}
      </ScrollArea.Autosize>
    </Modal>
  );
};

export default SearchModal;
