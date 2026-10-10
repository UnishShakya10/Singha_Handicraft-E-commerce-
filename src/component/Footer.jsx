import { Link } from "react-router";
import {
  Anchor,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";


const WHATSAPP_URL = "https://wa.me/9779860684495";
const EMAIL = "shakyayubraj4@gmail.com";
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Singha+Handicraft+Lalitpur+Nepal";

const Footer = () => {
  return (
    <footer className="bg-ink text-white">
      <Container size="xl" py={64}>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <Group>
                <ThemeIcon size={40} radius="xl" color="gold" c="black">
                  S
                </ThemeIcon>
                <Title order={3} c="gold.5">
                  Singha Handicraft
                </Title>
              </Group>
              <Text size="sm" c="gray.5" maw={420} lh={1.8}>
                Handcrafted Buddhist statues from Nepal. Copper, lost-wax bronze,
                and precious-metal finishes shaped by Himalayan artisans.
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="sm">
              <Text size="xs" fw={600} tt="uppercase" lts={3} c="gold.5">
                Visit
              </Text>
              <Group gap="xs" wrap="nowrap" align="flex-start">
                <MapPin size={16} color="#c9a227" style={{ flexShrink: 0, marginTop: 3 }} />
                <Anchor
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  c="gray.4"
                  underline="hover"
                >
                  Singha Handicraft, Lalitpur, Nepal
                </Anchor>
              </Group>
              <Group gap="xs" wrap="nowrap">
                <FaWhatsapp size={16} color="#c9a227" style={{ flexShrink: 0 }} />
                <Anchor
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  c="gray.4"
                  underline="hover"
                >
                  +977 9860684495 
                </Anchor>
              </Group>
              <Group gap="xs" wrap="nowrap">
                <Mail size={16} color="#c9a227" style={{ flexShrink: 0 }} />
                <Anchor
                  href={`mailto:${EMAIL}`}
                  size="sm"
                  c="gray.4"
                  underline="hover"
                >
                  {EMAIL}
                </Anchor>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="sm">
              <Text size="xs" fw={600} tt="uppercase" lts={3} c="gold.5">
                Explore
              </Text>
              <Anchor component={Link} to="/shop" c="gray.4" underline="hover">
                Shop
              </Anchor>
              <Anchor component={Link} to="/#gallery" c="gray.4" underline="hover">
                Gallery
              </Anchor>
              <Anchor component={Link} to="/about" c="gray.4" underline="hover">
                About
              </Anchor>
              <Anchor component={Link} to="/contact" c="gray.4" underline="hover">
                Contact Us
              </Anchor>
              <Text size="sm" c="gray.4">
                @singhahandicraft
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      <Text size="xs" ta="center" c="dark.2" py="md" className="border-t border-white/10">
        © {new Date().getFullYear()} Singha Handicraft. All rights reserved.
      </Text>
    </footer>
  );
};

export default Footer;