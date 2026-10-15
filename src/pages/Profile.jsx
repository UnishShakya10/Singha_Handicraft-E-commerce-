import { Link } from "react-router";
import { Avatar, Button, Container, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

const tiles = [
  {
    to: "/orders",
    title: "Orders",
    desc: "Track and review your purchases",
    label: "View orders",
    primary: true,
  },
  {
    to: "/cart",
    title: "Cart",
    desc: "Items waiting for checkout",
    label: "View cart",
    primary: false,
  },
];

const Profile = () => {
  const { user, avatarSrc } = useAuth();

  return (
    <Container size="md" py={64}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Group>
            <Avatar src={avatarSrc || undefined} size={72} radius="xl" color="gold" />
            <div>
              <Title order={2}>Welcome, {user?.fullName}</Title>
              <Text c="dimmed">{user?.email}</Text>
            </div>
          </Group>
          <Text size="sm" tt="capitalize" c="dimmed">{user?.role}</Text>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {tiles.map((t) => (
            <Paper
              key={t.to}
              withBorder
              radius="md"
              p="xl"
              style={{ transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Title order={4}>{t.title}</Title>
              <Text size="sm" c="dimmed" mt={4}>{t.desc}</Text>
              <Button
                component={Link}
                to={t.to}
                fullWidth
                mt="lg"
                color={t.primary ? "dark" : undefined}
                variant={t.primary ? "filled" : "default"}
              >
                {t.label}
              </Button>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default Profile;