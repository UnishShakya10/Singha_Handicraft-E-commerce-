import { Link } from "react-router";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChevronDown, Search, ShoppingBag, User } from "lucide-react";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { statueCategories } from "../data/statueCategories";
// ---------- MENU ITEMS (edit these) ----------

// helper: makes a link like /shop?category=Green%20Tara
const catUrl = (name) => `/shop?category=${encodeURIComponent(name)}`;
const Nav = () => {
  // Links with no dropdown
  const simpleLinks = {
    home: { label: "Home", to: "/" },
    lifeSize: { label: "Life-Size Statues", to: catUrl("Life-Size Statues") },
    bundle: { label: "Bundle & Save", to: catUrl("Bundle Packs") },
  };

  // Links with a dropdown
  const dropdowns = {
    statues: {
      label: "Statue Categories",
      to: "/shop",
      items: [
        { label: "All Statues", to: "/shop" },
        ...statueCategories.map(({ label, children = [] }) => ({
          label,
          to: catUrl(label),
          ...(children.length ? { children: children.map((child) => ({ label: child, to: catUrl(child) })) } : {}),
        })),
      ],
    },
    about: {
      label: "About Us", to :"/about"
      
    },
  };

  // The order of the menu bar, left to right
  const menuOrder = [
    simpleLinks.home,
    dropdowns.statues,
    simpleLinks.lifeSize,
    simpleLinks.bundle,
    dropdowns.about,
  ];

// ---------- SMALL PIECES ----------

// A plain link in the menu bar
const MenuLink = ({ item, onClick }) => {
  const isExternal = /^https?:\/\//.test(item.to || "");

  return (
    <Anchor
      component={isExternal ? "a" : Link}
      to={isExternal ? undefined : item.to}
      href={isExternal ? item.to : undefined}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      onClick={onClick}
      c="gray.2"
      fz="sm"
      underline="hover"
    >
      {item.label}
    </Anchor>
  );
};

// A link that opens a dropdown when you hover over it
const MenuDropdown = ({ item }) => (
  <Menu
    trigger="hover"
    openDelay={50}
    closeDelay={150}
    shadow="md"
    width={230}
    styles={{
      dropdown: {
        backgroundColor: "#14110d",
        border: "1px solid rgba(201, 162, 39, 0.35)",
      },
      item: {
        color: "#ffffff",
        fontSize: 14,
      },
    }}
  >
    <Menu.Target>
      <Button
        className="nav-top-button"
        variant="subtle"
        color="gray"
        c="gray.2"
        fz="sm"
        fw={400}
        rightSection={<ChevronDown size={14} />}
      >
        {item.label}
      </Button>
    </Menu.Target>

    <Menu.Dropdown>
      {item.items.map((sub) =>
        sub.children ? (
          // this item has a side panel
          <Menu.Sub key={sub.label} openDelay={50} closeDelay={150}>
            <Menu.Sub.Target>
              <Menu.Sub.Item component={Link} to={sub.to} className="nav-dropdown-item">
                {sub.label}
              </Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              {sub.children.map((child) => (
                <Menu.Item
                  key={child.label}
                  component={Link}
                  to={child.to}
                  className="nav-dropdown-item"
                >
                  {child.label}
                </Menu.Item>
              ))}
            </Menu.Sub.Dropdown>
          </Menu.Sub>
        ) : (
          // plain link
          <Menu.Item
            key={sub.label}
            component={Link}
            to={sub.to}
            className="nav-dropdown-item"
          >
            {sub.label}
          </Menu.Item>
        )
      )}
    </Menu.Dropdown>
  </Menu>
);

// ---------- MAIN NAVBAR ----------

  const [menuOpen, menu] = useDisclosure(false);
  const [searchOpen, search] = useDisclosure(false);
  const [cartOpen, cart] = useDisclosure(false);
  const { isLoggedIn, user, role, avatarSrc, logout } = useAuth();
  const { items: cartItems } = useCart();
  const { products } = useProducts();

  // number shown on the cart icon
  const count = cartItems.reduce(
    (total, item) =>
      products.some((p) => p.id === item.id && p.isActive !== false)
        ? total + item.quantity
        : total,
    0
  );

  return (
    <Box bg="#0d0d0d">
      {/* ===== TOP ROW: logo, search, account, cart ===== */}
      <Group h={72} px="md" justify="space-between" maw={1280} mx="auto" wrap="nowrap">
        {/* Logo */}
        <Anchor component={Link} to="/" underline="never">
          <Group gap="sm" wrap="nowrap">
            <Box
              w={40}
              h={40}
              bg="gold.5"
              c="black"
              fz="lg"
              fw={700}
              style={{
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              S
            </Box>
            <Text c="gold.5" ff="heading" fz="xl" fw={600} lts={2} visibleFrom="xs">
              SINGHA HANDICRAFT
            </Text>
          </Group>
        </Anchor>

        {/* Search bar (clicking it opens your search popup) */}
        <TextInput
          placeholder="Search statues..."
          readOnly
          onClick={search.open}
          rightSection={<Search size={18} />}
          w={380}
          visibleFrom="md"
          style={{ cursor: "pointer" }}
        />

        {/* Right side: account + cart */}
        <Group gap="md" wrap="nowrap">
          {/* Account (desktop only) */}
          <Group gap="sm" visibleFrom="md" wrap="nowrap">
            {isLoggedIn && user ? (
              <>
                <Avatar src={avatarSrc || undefined} radius="xl" size={34} color="gold">
                  <User size={16} />
                </Avatar>
                <Text c="gold.5" size="sm">
                  {user.fullName?.split(" ")[0]}
                </Text>
                {role === "admin" && (
                  <Button component={Link} to="/admin" variant="subtle" color="gold" size="xs">
                    Admin
                  </Button>
                )}
                <Button variant="outline" color="gray" size="xs" onClick={logout}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login"  color="gold" c="black" size="sm">
                  Login
                </Button>
                <Button component={Link} to="/signup" color="gold" c="black" size="sm">
                  Sign up
                </Button>
              </>
            )}
          </Group>

          {/* Search icon (mobile only) */}
          <ActionIcon hiddenFrom="md" variant="subtle" c="white" onClick={search.open} aria-label="Search">
            <Search size={20} />
          </ActionIcon>

          {/* Cart */}
          <Indicator disabled={count === 0} label={count} size={16} color="gold" c="black">
            <ActionIcon variant="subtle" c="white" size="lg" onClick={cart.open} aria-label="Cart">
              <ShoppingBag size={20} />
            </ActionIcon>
          </Indicator>

          {/* Burger (mobile only) */}
          <Burger hiddenFrom="md" opened={menuOpen} onClick={menu.toggle} color="white" size="sm" />
        </Group>
      </Group>

      {/* ===== BOTTOM ROW: menu (desktop only) ===== */}
      <Box visibleFrom="md" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Group h={48} justify="center" gap="xl">
          {menuOrder.map((item) =>
            item.items ? (
              <MenuDropdown key={item.label} item={item} />
            ) : (
              <MenuLink key={item.label} item={item} />
            )
          )}
        </Group>
      </Box>

      {/* ===== MOBILE MENU ===== */}
      {menuOpen && (
        <Stack hiddenFrom="md" px="md" py="md" gap="sm">
          {menuOrder.map((item) =>
            item.items ? (
              // dropdown groups: show the title, then its links below
              <div key={item.label}>
                <Text size="xs" tt="uppercase" c="gold.5" fw={700} mb={4}>
                  {item.label}
                </Text>
                <Stack gap={4} pl="sm">
                  {item.items.map((sub) => (
                    <MenuLink key={sub.label} item={sub} onClick={menu.close} />
                  ))}
                </Stack>
              </div>
            ) : (
              <MenuLink key={item.label} item={item} onClick={menu.close} />
            )
          )}

          {/* Account buttons */}
          {isLoggedIn ? (
            <Button variant="subtle" color="gold" justify="flex-start" onClick={logout}>
              Sign out
            </Button>
          ) : (
            <Group>
              <Button component={Link} to="/login" variant="outline" color="gold" size="sm" onClick={menu.close}>
                Login
              </Button>
              <Button component={Link} to="/signup" color="gold" c="black" size="sm" onClick={menu.close}>
                Sign up
              </Button>
            </Group>
          )}
        </Stack>
      )}

      <SearchModal opened={searchOpen} onClose={search.close} />
      <WishlistDrawer />
      <CartDrawer opened={cartOpen} onClose={cart.close} />
    </Box>
  );
};

export default Nav;