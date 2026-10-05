import { Anchor, Group } from "@mantine/core";
import { Link } from "react-router";
import { statueCategories } from "../data/statueCategories";

const categoryUrl = (name) => `/shop?category=${encodeURIComponent(name)}`;

const Category = () => (
  <Group gap="sm" mb="xl">
    {statueCategories.flatMap(({ label, children = [] }) => [label, ...children]).map((name) => (
      <Anchor
        key={name}
        component={Link}
        to={categoryUrl(name)}
        c="dark"
        fz="sm"
        px="sm"
        py={6}
        style={{
          border: "1px solid var(--mantine-color-gray-4)",
          borderRadius: "var(--mantine-radius-xl)",
          textDecoration: "none",
        }}
      >
        {name}
      </Anchor>
    ))}
  </Group>
);

export default Category;