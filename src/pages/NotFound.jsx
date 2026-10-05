import { Link } from "react-router";
import { Button, Container, Stack, Text, Title } from "@mantine/core";

const NotFound = () => (
  <Container size="sm" py={120}>
    <Stack align="center" ta="center" gap="md">
      <Text size="xs" tt="uppercase" lts={4} c="gold.6">
        404
      </Text>
      <Title order={1}>Page not found</Title>
      <Text c="dimmed" maw={420}>
        This path does not exist in the atelier. Return home or browse the
        collection.
      </Text>
      <Button.Group>
        <Button component={Link} to="/" color="dark">
          Home
        </Button>
        <Button component={Link} to="/shop" variant="outline" color="dark">
          Shop
        </Button>
      </Button.Group>
    </Stack>
  </Container>
);

export default NotFound;
