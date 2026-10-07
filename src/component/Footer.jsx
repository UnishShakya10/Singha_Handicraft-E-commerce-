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
import { Mail, MapPin, Phone } from "lucide-react";

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
                <MapPin size={16} color="#c9a227" />
                <Text size="sm" c="gray.4">
                  Singha Handicraft, Lalitpur, Nepal
                </Text>
              </Group>
              <Group gap="xs">
                <Phone size={16} color="#c9a227" />
                <Text size="sm" c="gray.4">
                  +977 9861616232
                </Text>
              </Group>
              <Group gap="xs">
                <Mail size={16} color="#c9a227" />
                <Text size="sm" c="gray.4">
                  hello@singhahandicraft.com
                </Text>
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
