import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Accordion,
  Badge,
  Button,
  Container,
  Grid,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  ArrowLeft,
  Check,
  Heart,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/api";
import Cards from "../component/Cards";
import ProductGallery from "../component/ProductGallery";

// Replace with your number in international format, digits only (no +)
const WHATSAPP_NUMBER = "977XXXXXXXXXX";

// Colors used on this page (change here to change everywhere)
const GOLD = "#c9a227";
const INK = "#14110d";
const CREAM = "#f7f3ea";
const LINE = "rgba(20, 17, 13, 0.12)";

// Small heading with a short gold line under it
const SectionTitle = ({ eyebrow, children }) => (
  <div>
    {eyebrow && (
      <Text size="xs" fw={700} tt="uppercase" lts={3} c="gold.7">
        {eyebrow}
      </Text>
    )}
    <Title order={2} ff="heading" fz={{ base: 28, md: 34 }} fw={500} mt={4}>
      {children}
    </Title>
    <div style={{ width: 48, height: 2, background: GOLD, marginTop: 12 }} />
  </div>
);

const ProductDetail = () => {
  const { productId } = useParams();
  const { products } = useProducts();
  const { addItem } = useCart();
  const { isSaved, toggleItem } = useWishlist();
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const product = products.find((item) => item.id === productId && item.isActive !== false);

  if (!product) {
    return (
      <Container size="sm" py={120}>
        <Stack align="center" ta="center" gap="md">
          <Text size="xs" tt="uppercase" lts={4} c="gold.6">
            Product unavailable
          </Text>
          <Title order={1}>This piece is not available</Title>
          <Text c="dimmed" maw={420}>
            The selected statue is not in the current collection.
          </Text>
          <Button component={Link} to="/shop" color="gold" c="black">
            Back to shop
          </Button>
        </Stack>
      </Container>
    );
  }

  const isProductSaved = isSaved(product.id);
  const detailSections = [
    ["Description", product.description?.trim() || "Description details have not been provided for this piece yet."],
    ["Iconography", product.iconography?.trim() || "Iconography details have not been provided for this piece yet."],
    [
      "Spiritual significance",
      product.significance?.trim()
        || product.spiritualPresence?.trim()
        || "Spiritual significance details have not been provided for this piece yet.",
    ],
  ];
  const hasLongDetails = detailSections.reduce((total, [, content]) => total + content.length, 0) > 700;
  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.isActive !== false &&
        (item.category === product.category || item.collection === product.collection)
    )
    .slice(0, 4);

  const handmadeNote =
    "Each statue is handcrafted in Nepal, so slight variations in finish, patina, and dimensions may occur. These pieces are intended for devotional, decorative, or collector use and may differ slightly from the photography due to natural hand-finishing and lighting.";

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello, I'm interested in ${product.title}`
  )}`;

  const specs = [
    ["Origin", product.origin],
    ["Material", product.material],
    ["Finish time", product.finishTime],
    ["Dimensions (in / cm)", product.height],
  ].filter(([, value]) => value);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Container size="xl" py={48}>
        <Button
          component={Link}
          to="/shop"
          variant="subtle"
          color="dark"
          leftSection={<ArrowLeft size={16} />}
          mb="xl"
          px={0}
          tt="uppercase"
          lts={1.5}
          fz="xs"
        >
          Back to collection
        </Button>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={64} style={{ alignItems: "start" }}>
          {/* LEFT: gallery (stays in view while you scroll on desktop) */}
          <div style={{ position: "sticky", top: 110 }}>
            {images.length > 0 ? (
              <ProductGallery
                key={product.id}
                images={images}
                name={product.title}
              />
            ) : (
              <div className="grid aspect-square place-items-center bg-white text-gray-500">
                No product images available
              </div>
            )}
          </div>

          {/* RIGHT: product info */}
          <Stack gap="lg">
            <Badge
              color="gold"
              variant="outline"
              tt="uppercase"
              fw={700}
              lts={2}
              radius="xs"
              w="fit-content"
            >
              {product.category}
            </Badge>

            <Title order={1} ff="heading" fz={{ base: 34, md: 48 }} fw={500} lh={1.1}>
              {product.title}
            </Title>

            <div style={{ width: 56, height: 2, background: GOLD }} />

            <Text c="dimmed" size="lg" lh={1.8} lineClamp={3}>
              {product.description}
            </Text>

            {/* Price */}
            <Group align="flex-end" gap="sm" py="xs">
              <Text ff="heading" fw={600} fz={42} lh={1} c="dark">
                {formatPrice(product.price)}
              </Text>
              {Number(product.compareAtPrice) > Number(product.price) && (
                <Text size="md" c="dimmed" td="line-through">
                  {formatPrice(product.compareAtPrice)}
                </Text>
              )}
            </Group>

            {/* Buttons */}
            <Group gap="md">
              <Button
                color="gold"
                c="black"
                size="lg"
                radius="xs"
                tt="uppercase"
                lts={1.5}
                fz="sm"
                px={36}
                leftSection={<ShoppingBag size={18} />}
                onClick={() => addItem(product)}
              >
                Add to cart
              </Button>
              <Button
                variant="outline"
                color={isProductSaved ? "red" : "dark"}
                size="lg"
                radius="xs"
                tt="uppercase"
                lts={1.5}
                fz="sm"
                px={36}
                leftSection={
                  <Heart
                    size={18}
                    fill={isProductSaved ? "currentColor" : "none"}
                  />
                }
                aria-pressed={isProductSaved}
                onClick={() => toggleItem(product)}
              >
                {isProductSaved ? "Saved to wishlist" : "Add to wishlist"}
              </Button>
              <Button
                component="a"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                color="dark"
                size="lg"
                radius="xs"
                tt="uppercase"
                lts={1.5}
                fz="sm"
                px={36}
                leftSection={<MessageCircle size={18} />}
              >
                Inquire
              </Button>
            </Group>

            {/* Specs */}
            <div
              style={{
                borderTop: `1px solid ${LINE}`,
                borderBottom: `1px solid ${LINE}`,
                marginTop: 8,
              }}
            >
              {specs.map(([label, value], index) => (
                <Group
                  key={label}
                  justify="space-between"
                  wrap="nowrap"
                  py="sm"
                  style={{ borderTop: index === 0 ? "none" : `1px solid ${LINE}` }}
                >
                  <Text size="xs" c="dimmed" tt="uppercase" lts={1.5}>
                    {label}
                  </Text>
                  <Text size="sm" fw={600} ta="right" style={{ whiteSpace: "pre-line" }}>
                    {value}
                  </Text>
                </Group>
              ))}
            </div>
          </Stack>
        </SimpleGrid>

        {/* ABOUT THIS PIECE */}
        <section aria-labelledby="product-details-title" style={{ marginTop: 96 }}>
          <Stack gap="lg" maw={1000}>
            <div id="product-details-title">
              <SectionTitle eyebrow="Craft & meaning">About this piece</SectionTitle>
            </div>

            <div
              id="product-details-content"
              style={{
                position: "relative",
                maxHeight: hasLongDetails && !detailsExpanded ? 300 : "none",
                overflow: "hidden",
              }}
            >
              <Stack gap={0}>
                {detailSections.map(([heading, content]) => (
                  <div
                    key={heading}
                    style={{ borderTop: `1px solid ${LINE}`, paddingBlock: "1.5rem" }}
                  >
                    <Grid gutter="xl" align="start">
                      <Grid.Col span={{ base: 12, sm: 3 }}>
                        <Text size="xs" fw={700} tt="uppercase" lts={2} c="gold.8">
                          {heading}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 9 }}>
                        <Text fz={17} lh={1.9} c="dark.7">
                          {content}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </div>
                ))}
              </Stack>

              {/* soft fade at the bottom while collapsed */}
              {hasLongDetails && !detailsExpanded && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 90,
                    background: "linear-gradient(to bottom, rgba(255,255,255,0), var(--mantine-color-body, #fff))",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            {hasLongDetails && (
              <Button
                variant="outline"
                color="dark"
                radius="xs"
                tt="uppercase"
                lts={1.5}
                fz="xs"
                w="fit-content"
                aria-expanded={detailsExpanded}
                aria-controls="product-details-content"
                onClick={() => setDetailsExpanded((expanded) => !expanded)}
              >
                View {detailsExpanded ? "less" : "more"}
              </Button>
            )}
          </Stack>
        </section>

        {/* HANDMADE NOTE */}
        <section
          aria-label="Handmade note"
          style={{
            background: CREAM,
            borderLeft: `3px solid ${GOLD}`,
            padding: "1.5rem 1.75rem",
            marginTop: 40,
            maxWidth: 1000,
          }}
        >
          <Text size="xs" c="dark" fw={700} tt="uppercase" lts={2} mb={8}>
            Handmade note
          </Text>
          <Text fz={15} c="dimmed" lh={1.8}>
            {handmadeNote}
          </Text>
        </section>

        {/* CARE + SHIPPING */}
        <Accordion
          variant="default"
          maw={1000}
          mt={40}
          styles={{
            item: { borderBottom: `1px solid ${LINE}` },
            control: { padding: "1.25rem 0" },
            label: { fontFamily: "var(--mantine-font-family-headings)", fontSize: 20 },
            content: { paddingBottom: "1.25rem" },
          }}
        >
          <Accordion.Item value="care">
            <Accordion.Control>How to care for your statue</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Text c="dimmed" lh={1.8}>
                  Our statues are handcrafted works of Buddhist art. Proper care helps
                  preserve their gilding, intricate details, and traditional finish.
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                  {[
                    [
                      "Dust gently",
                      "Use a soft, clean cotton or microfiber cloth. Avoid rough cloths and hard brushes.",
                    ],
                    [
                      "Keep dry",
                      "Keep the statue away from damp areas. If moisture appears, gently wipe it with a dry cloth.",
                    ],
                    [
                      "Avoid sun and chemicals",
                      "Keep away from prolonged direct sunlight and excessive heat. Do not use metal polish, detergent, alcohol, bleach, vinegar, or other chemical cleaners.",
                    ],
                    [
                      "Handle with care",
                      "Support the base and main body when moving the statue. Do not lift it by delicate details such as the crown, jewelry, hands, or weapons.",
                    ],
                    [
                      "Place mindfully",
                      "Keep statues a safe distance from butter lamps, incense, candles, flame, soot, and smoke.",
                    ],
                    [
                      "Store safely",
                      "Wrap in a soft, clean material and keep in a dry, protected place. Do not place heavy objects on top.",
                    ],
                  ].map(([title, description]) => (
                    <div key={title}>
                      <Text size="sm" fw={700} c="dark" mb={4}>{title}</Text>
                      <Text size="sm" c="dimmed" lh={1.7}>{description}</Text>
                    </div>
                  ))}
                </SimpleGrid>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="shipping">
            <Accordion.Control>Shipping &amp; returns</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xl">
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                  <div>
                    <Text fw={700} c="dark" mb="xs">Shipping within Nepal</Text>
                    <List c="dimmed" size="sm" spacing="xs" withPadding>
                      <List.Item>Delivery is available to major cities and locations across Nepal.</List.Item>
                      <List.Item>Delivery time depends on the destination and product availability.</List.Item>
                      <List.Item>Large or heavy statues may need special handling and delivery arrangements.</List.Item>
                      <List.Item>Any shipping charges will be shown at checkout or confirmed before dispatch.</List.Item>
                      <List.Item>Please ensure your delivery address and contact number are correct. Order and delivery updates are provided where available.</List.Item>
                    </List>
                  </div>
                  <div>
                    <Text fw={700} c="dark" mb="xs">International shipping</Text>
                    <List c="dimmed" size="sm" spacing="xs" withPadding>
                      <List.Item>International orders are shipped from Nepal through DHL Express.</List.Item>
                      <List.Item>Estimated delivery is 4–10 business days after dispatch, depending on destination.</List.Item>
                      <List.Item>Insured shipping is provided for eligible statue orders. A tracking number is shared after dispatch.</List.Item>
                      <List.Item>Customers are responsible for customs duties, import taxes, and clearance charges imposed by their country.</List.Item>
                      <List.Item>Customs clearance and other circumstances beyond our control may affect delivery times.</List.Item>
                    </List>
                  </div>
                </SimpleGrid>
                <div>
                  <Text fw={700} c="dark" mb="xs">Returns &amp; exchanges</Text>
                  <List c="dimmed" size="sm" spacing="xs" withPadding>
                    <List.Item>Eligible products may be returned within 14 days of delivery in their original, unused, and undamaged condition, preferably with original packaging.</List.Item>
                    <List.Item>Contact us with your order details before sending an item back. Photographs may be requested to help assess the issue.</List.Item>
                    <List.Item>Damage caused by improper handling, installation, or care may not qualify for a return. Return arrangements and costs depend on the reason.</List.Item>
                    <List.Item>If an item arrives damaged or incorrect, contact us as soon as possible so we can assist.</List.Item>
                  </List>
                </div>
                <div
                  style={{
                    borderLeft: `2px solid ${GOLD}`,
                    background: CREAM,
                    padding: "1rem 1.25rem",
                  }}
                >
                  <Text fw={700} c="dark" mb={4}>Consecrated statues</Text>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    Statues that have undergone consecration or religious rituals
                    are non-returnable and non-refundable.
                  </Text>
                </div>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {/* WHY COLLECTORS CHOOSE THIS PIECE */}
        <Stack mt={96} gap="xl">
          <SectionTitle>Why collectors choose this piece</SectionTitle>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            {[
              "Crafted in Patan by experienced Nepalese artisans.",
              "Finished with precious metal and traditional hand-chasing techniques.",
              "Made for devotional practice, gifting, and discerning home interiors.",
            ].map((item) => (
              <div
                key={item}
                style={{
                  borderTop: `2px solid ${GOLD}`,
                  background: CREAM,
                  padding: "1.5rem",
                }}
              >
                <Group align="flex-start" gap="sm" wrap="nowrap">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: INK,
                      color: GOLD,
                      flexShrink: 0,
                    }}
                  >
                    <Check size={16} />
                  </span>
                  <Text c="dark.7" lh={1.8}>
                    {item}
                  </Text>
                </Group>
              </div>
            ))}
          </SimpleGrid>
        </Stack>

        {/* RELATED */}
        {related.length > 0 && (
          <Stack mt={96} gap="xl">
            <SectionTitle>Related pieces</SectionTitle>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              {related.map((item) => (
                <Cards key={item.id} product={item} />
              ))}
            </SimpleGrid>
          </Stack>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;