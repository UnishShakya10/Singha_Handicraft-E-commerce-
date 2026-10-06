import { Link } from "react-router";
import {
  Button,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ArrowRight, Image as ImageIcon, Sparkles } from "lucide-react";
import Cards from "../component/Cards";
import Category from "../component/Category";
import { useProducts } from "../context/ProductContext";

const Home = () => {
  const { products } = useProducts();
  const galleryItems = products
    .filter((product) => product.isActive !== false && product.image)
    .slice(0, 12);
  const featured = products
    .filter((product) => product.isActive !== false && product.collection === "best-sellers")
    .slice(0, 4);
  return (
    <div className="bg-ink text-white">
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="/Golden Buddha Shrine with Incense and Candlelight.png"
          alt="Sacred Himalayan statue"
          className="absolute inset-0 h-full w-full"
          h="100%"
          fit="cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/25" />

        <Container size="xl" className="relative flex min-h-[88vh] items-center">
          <Stack maw={720} gap="lg">
            <Group gap="sm" c="gold.5">
              <Sparkles size={16} />
              <Text size="xs" tt="uppercase" lts={4} c="gold.5">
                Handcrafted in Nepal
              </Text>
            </Group>
            <Title
              order={1}
              fz={{ base: 48, sm: 72, lg: 88 }}
              lh={1.05}
              c="white"
            >
              Sacred art
              <Text span display="block" c="gold.5" inherit>
                of the Himalaya
              </Text>
            </Title>
            <Text maw={520} c="gray.3" size="lg" lh={1.8}>
              Copper and bronze Buddhist sculpture, finished with precious
              metal and shaped by Patan artisans. Each piece is a devotion to
              form, lineage, and quiet presence.
            </Text>
            <Group>
              <Button
                component={Link}
                to="/shop"
                size="lg"
                color="gold"
                c="black"
                rightSection={<ArrowRight size={18} />}
              >
                Explore collection
              </Button>
              <Button
                component={Link}
                to="/about"
                size="lg"
                variant="outline"
                color="gray"
                c="white"
              >
                Our atelier
              </Button>
            </Group>
          </Stack>
        </Container>
      </section>

      <section className="border-y border-gold/20 bg-ink-soft">
        <Container size="xl" py="xl">
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg">
            {[
              ["Est. craft", "Patan, Nepal"],
              ["Material", "Copper & bronze"],
              ["Finish", "Gold & silver plate"],
              ["Made", "By hand, to order"],
            ].map(([label, value]) => (
              <div key={label}>
                <Text size="xs" tt="uppercase" lts={3} c="gold.5">
                  {label}
                </Text>
                <Title order={4} c="white" mt={6}>
                  {value}
                </Title>
              </div>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <section className="bg-cream py-24 text-ink">
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={64}>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full border border-gold" />
              <Image
                src="/work.jpg"
                alt="Workshop sculpture"
                h={520}
                fit="cover"
                className="relative"
              />
            </div>
            <Stack justify="center">
              <Text size="xs" fw={600} tt="uppercase" lts={3} c="gold.6">
                About Singha Handicraft
              </Text>
              <Title order={2} fz={{ base: 36, sm: 48 }}>
                Where lineage meets
                <Text span display="block" c="gold.6" inherit>
                  the maker’s hand.
                </Text>
              </Title>
              <Text c="dimmed" lh={1.8}>
                Our studio in Lalitpur continues the metal-casting traditions
                of the Newar community—lost-wax, chasing, and fire-gilding.
              </Text>
              <Text c="dimmed" lh={1.8}>
                Collectors, monasteries, and private chapels commission work
                that is measured, quiet, and built to last generations.
              </Text>
              <Button
                component={Link}
                to="/about"
                variant="subtle"
                color="gold"
                justify="flex-start"
                px={0}
                rightSection={<ArrowRight size={16} />}
              >
                Read our story
              </Button>
            </Stack>
          </SimpleGrid>
        </Container>
      </section>

      <section className="bg-paper py-24 text-ink">
        <Container size="xl">
          <Group justify="space-between" mb="xl" align="flex-end">
            <div>
              <Text size="xs" tt="uppercase" lts={3} c="gold.6">
                Selected works
              </Text>
              <Title order={2} mt={8}>
                From the collection
              </Title>
            </div>
            <Button component={Link} to="/shop" variant="subtle" color="gold">
              View all pieces →
            </Button>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            {featured.map((product) => (
              <Cards key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <section id="gallery" className="bg-cream py-24 text-ink">
        <Container size="xl">
          <Group justify="space-between" align="flex-end" mb="xl">
            <Stack gap="xs">
              <Group gap="xs" c="gold.6">
                <ImageIcon size={16} />
                <Text size="xs" fw={600} tt="uppercase" lts={3}>
                  Studio archive
                </Text>
              </Group>
              <Title order={2}>The art of Nepal</Title>
              <Text c="dimmed" maw={560}>
                A visual record of wood, metal, and sacred sculpture from the atelier.
              </Text>
            </Stack>
            <Button component={Link} to="/shop" variant="subtle" color="gold" rightSection={<ArrowRight size={16} />}>
              Explore collection
            </Button>
          </Group>

          <Category />

          <div className="grid auto-rows-[120px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-4 md:gap-4">
            {galleryItems.map((item, index) => (
              <Link
                key={item.id}
                to={`/shop/${item.id}`}
                aria-label={`View ${item.title}`}
                className={`group relative block overflow-hidden bg-black ${
                  [0, 3, 6].includes(index)
                    ? "col-span-2 row-span-2"
                    : "col-span-1 row-span-1"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  h="100%"
                  fit="cover"
                  className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent transition-colors group-hover:from-black/85" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <Title order={3} c="white" lh={1.2} fz={{ base: "md", sm: "xl" }}>
                    {item.title}
                  </Title>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
