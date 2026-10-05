import { Link } from "react-router";
import { Avatar, Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, avatarSrc } = useAuth();

  return (
    <Container size="md" py={64}>
      <Stack gap="lg">
        <Title order={1}>Your profile</Title>
        <Group>
          <Avatar src={avatarSrc || undefined} size={64} radius="xl" color="gold" />
          <Stack gap={2}>
            <Text fw={600}>{user?.fullName}</Text>
            <Text c="dimmed">{user?.email}</Text>
            <Text size="sm" tt="capitalize">{user?.role}</Text>
          </Stack>
        </Group>
        <Group>
          <Button component={Link} to="/orders" color="dark">View orders</Button>
          <Button component={Link} to="/cart" variant="default">View cart</Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default Profile;