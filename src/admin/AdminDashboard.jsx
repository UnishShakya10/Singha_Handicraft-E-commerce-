import { useEffect, useState } from "react";
import {
  ActionIcon, Badge, Button, Divider, FileButton, Group, Image, Modal, Paper,
  Select, SimpleGrid, Stack, Table, Textarea, Text, TextInput, Title,
} from "@mantine/core";
import {
  ArrowUpRight, Boxes, ChevronLeft, ChevronRight, ClipboardList, Eye, LayoutDashboard, LogOut,
  Images, Package, Plus, RefreshCw, Shapes, Trash2, UsersRound,
} from "lucide-react";
import { api, fileUrl, formatPrice } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import Shop from "../pages/Shop";
import Invoice from "../component/Invoice";

/* ───────────────────────────── SCHEMAS ─────────────────────────────
* @typedef {Object} Product   (from useProducts)
* @property {string} _id
* @property {number} price
* @property {number} stock
* @property {string} [categoryId]   ref -> Category._id (preferred link)
* @property {string} [category]     category name (legacy fallback link)
*
* @typedef {Object} Category  (from useProducts)
* @property {string} _id
* @property {string} name          max 60 chars
* @property {string} description   max 300 chars
* @property {string} [image]       uploaded image URL
*
* @typedef {Object} Order     (GET /orders, PATCH /orders/:id)
* @property {string} _id
* @property {string} invoiceNumber
* @property {Customer} [user]      populated user
* @property {string} createdAt     ISO date
* @property {"pending"|"confirmed"|"delivered"|"cancelled"} status
* @property {number} totalAmount
*
* @typedef {Object} Customer  (GET /users/getAll)
* @property {string} _id
* @property {string} fullName
* @property {string} email
* @property {"admin"|"customer"} role
* @property {string} [avatar]
*
* @typedef {Object} AuthUser  (from useAuth)
* @property {string} fullName
* ─────────────────────────────────────────────────────────────────── */

// ── Constants ──
const navigation = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "variants", label: "Variant Management", icon: Boxes },
  { key: "categories", label: "Categories", icon: Shapes },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "customers", label: "Customers", icon: UsersRound },
];
const sectionTitles = Object.fromEntries(navigation.map((n) => [n.key, n.label]));

/** Order.status enum */
const orderStatuses = ["pending", "confirmed", "delivered", "cancelled"];
const statusColors = { pending: "yellow", confirmed: "blue", delivered: "green", cancelled: "red" };
const normalizeOrderStatus = (status) => ({
  placed: "pending",
  processing: "confirmed",
  shipped: "confirmed",
})[status] || status || "pending";
const getOrderStatusColor = (status) => statusColors[normalizeOrderStatus(status)] || "gray";

const CATEGORY_ADDED = "Category added.";
const CATEGORY_DELETED = "Category deleted.";
const ADMIN_PAGE_SIZE = 10;
const sumBy = (list, fn) => list.reduce((t, x) => t + fn(x), 0);
const errMsg = (e, fallback) => e?.response?.data?.message || fallback;

const AdminDashboard = () => {
  // ── State: navigation ──
  const [section, setSection] = useState("overview");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [sevenDaysAgo] = useState(() => new Date(Date.now() - 7 * 864e5));

  // ── State: Order[] / Customer[] ──
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [ordersMessage, setOrdersMessage] = useState("");
  const [customersMessage, setCustomersMessage] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [updatingPaymentOrderId, setUpdatingPaymentOrderId] = useState("");
  const [invoiceOpened, setInvoiceOpened] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [orderOpened, setOrderOpened] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState("");

  // ── State: Category form ──
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryDeletingId, setCategoryDeletingId] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryModalOpened, setCategoryModalOpened] = useState(false);
  const [categoryPage, setCategoryPage] = useState(0);

  // ── Context: AuthUser / Product[] / Category[] ──
  const { user, logout } = useAuth();
const {
  products,
  categories,
  addCategory,
  removeCategory,
  uploadImage,
  updateProduct,
} = useProducts();


  // Variant Management state
  const [selectedVariantProductId, setSelectedVariantProductId] = useState("");
  const [variantForm, setVariantForm] = useState([]);
  const [variantMessage, setVariantMessage] = useState("");
  const [variantSaving, setVariantSaving] = useState(false);

  
const selectedVariantProduct = products.find(
  (product) => String(product.id) === String(selectedVariantProductId)
);

const handleVariantProductChange = (productId) => {
  setSelectedVariantProductId(productId);
  const product = products.find(
    (item) => String(item.id) === String(productId)
  );

  setVariantForm(
    (product?.variants || []).map((variant) => ({
      finish: variant.finish || "",
      price: Number(variant.price) || 0,
      stock: Number(variant.stock) || 0,
      sku: variant.sku || "",
      images: variant.images || [],
      isActive: variant.isActive !== false,
    }))
  );
  setVariantMessage("");
};

const updateVariantField = (index, field, value) => {
  setVariantForm((current) =>
    current.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    )
  );
};

const addFinishVariant = () => {
  setVariantForm((current) => [
    ...current,
    {
      finish: "",
      price: 0,
      stock: 0,
      sku: "",
      images: [],
      isActive: true,
    },
  ]);
};

const removeFinishVariant = (index) => {
  setVariantForm((current) =>
    current.filter((_, i) => i !== index)
  );
};


const saveFinishVariants = async () => {
  if (!selectedVariantProduct) {
    setVariantMessage("Please select a product first.");
    return;
  }

  for (const variant of variantForm) {
    if (!variant.finish.trim()) {
      setVariantMessage("Please enter a finish for every variant.");
      return;
    }

    if (!Number.isFinite(Number(variant.price)) || Number(variant.price) < 0) {
      setVariantMessage("Variant price must be a valid non-negative number.");
      return;
    }

    if (
      !Number.isInteger(Number(variant.stock)) ||
      Number(variant.stock) < 0
    ) {
      setVariantMessage("Variant stock must be a non-negative whole number.");
      return;
    }
  }

  setVariantSaving(true);
  setVariantMessage("");

  try {
    await updateProduct(selectedVariantProduct.id, {
      variants: variantForm.map((variant) => ({
        finish: variant.finish.trim(),
        price: Number(variant.price),
        stock: Number(variant.stock),
        sku: variant.sku.trim(),
        images: variant.images,
        isActive: variant.isActive !== false,
      })),
    });

    setVariantMessage("Variants saved successfully.");
  } catch (error) {
    console.error("Failed to save variants:", error);
    setVariantMessage(
      error?.response?.data?.message || "Failed to save variants. Please try again."
    );
  } finally {
    setVariantSaving(false);
  }
};

  // ── Effects ──
  // Free the preview blob URL when it changes/unmounts
  useEffect(() => () => { if (categoryImagePreview) URL.revokeObjectURL(categoryImagePreview); }, [categoryImagePreview]);

  // Load Order[] + Customer[]
  useEffect(() => {
    let active = true;
    (async () => {
      const [o, c] = await Promise.allSettled([api.get("/orders/admin"), api.get("/users/getAll")]);
      if (!active) return;
      if (o.status === "fulfilled") { setOrders(o.value.data); setOrdersMessage(""); }
      else setOrdersMessage(errMsg(o.reason, "Could not load orders."));
      if (c.status === "fulfilled") setCustomers(c.value.data);
      else setCustomersMessage(errMsg(c.reason, "Could not load customers."));
      setOrdersLoading(false);
    })();
    return () => { active = false; };
  }, [refreshVersion]);

  // ── Derived metrics ──
  const stockCount = sumBy(products, (p) => Number(p.stock || 0));
  const inventoryValue = sumBy(products, (p) => Number(p.price || 0) * Number(p.stock || 0));
  const orderTotal = sumBy(orders, (o) => Number(o.totalAmount || 0));
  const recentOrderCount = orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo).length;

  // Product -> Category link: by categoryId, else by name
  const countProducts = (cat) =>
    products.filter((p) =>
      p.categoryId
        ? String(p.categoryId) === String(cat._id)
        : String(p.category || "").toLowerCase() === cat.name.toLowerCase()
    ).length;
  const categoryPageCount = Math.max(1, Math.ceil(categories.length / ADMIN_PAGE_SIZE));
  const currentCategoryPage = Math.min(categoryPage, categoryPageCount - 1);
  const visibleCategories = categories.slice(
    currentCategoryPage * ADMIN_PAGE_SIZE,
    (currentCategoryPage + 1) * ADMIN_PAGE_SIZE
  );

  // ── Handlers ──
  const refreshOrders = () => { setOrdersLoading(true); setRefreshVersion((v) => v + 1); };

  const handleCategoryImageChange = (file) => {
    setCategoryImageFile(file);
    setCategoryImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const name = categoryName.trim();
    const description = categoryDescription.trim();
    if (!name || !description) return;

    setCategorySaving(true);
    setCategoryMessage("");
    try {
      const image = categoryImageFile ? await uploadImage(categoryImageFile) : "";
      await addCategory({ name, description, image }); // Category payload
      setCategoryName("");
      setCategoryDescription("");
      handleCategoryImageChange(null); // also clears preview
      setCategoryMessage(CATEGORY_ADDED);
      setCategoryModalOpened(false);
    } catch (error) {
      setCategoryMessage(errMsg(error, "Could not add category."));
    } finally {
      setCategorySaving(false);
    }
  };

  const handleCategoryDelete = async () => {
    if (!categoryToDelete) return;
    const category = categoryToDelete;

    setCategoryDeletingId(category._id);
    setCategoryMessage("");
    try {
      await removeCategory(category._id);
      setCategoryMessage(CATEGORY_DELETED);
      setCategoryToDelete(null);
    } catch (error) {
      setCategoryMessage(errMsg(error, "Could not delete category."));
    } finally {
      setCategoryDeletingId("");
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    setOrdersMessage("");
    try {
      const { data } = await api.patch(`/orders/${orderId}`, { status });
      setOrders((cur) => cur.map((o) => (o._id === orderId ? data : o)));
    } catch (error) {
      setOrdersMessage(errMsg(error, "Could not update order status."));
    } finally {
      setUpdatingOrderId("");
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    setUpdatingPaymentOrderId(orderId);
    setOrdersMessage("");
    try {
      const { data } = await api.patch(`/orders/${orderId}`, { paymentStatus });
      const updatedOrder = data?.order || data;
      if (updatedOrder?.paymentStatus !== paymentStatus) {
        throw new Error(
          "The server did not confirm the payment status update. The backend must support paymentStatus."
        );
      }
      setOrders((current) =>
        current.map((order) =>
          order._id === orderId ? { ...order, ...updatedOrder } : order
        )
      );
      setSelectedOrder((current) =>
        current?._id === orderId
          ? { ...current, ...updatedOrder }
          : current
      );
    } catch (error) {
      setOrdersMessage(errMsg(error, "Could not update payment status."));
    } finally {
      setUpdatingPaymentOrderId("");
    }
  };

  const handleOrderDelete = async () => {
    if (!orderToDelete) return;
    const order = orderToDelete;

    setDeletingOrderId(order._id);
    setOrdersMessage("");
    try {
      await api.delete(`/orders/${order._id}`);
      setOrders((cur) => cur.filter((o) => o._id !== order._id));
      setOrderToDelete(null);
    } catch (error) {
      setOrdersMessage(errMsg(error, "Could not delete order."));
      setOrderToDelete(null);
    } finally {
      setDeletingOrderId("");
    }
  };

  const handleViewInvoice = (order) => {
    setInvoiceOpened(true);
    setSelectedInvoice({
      number: order.invoiceNumber || `Order-${order._id.slice(-7)}`,
      date: order.createdAt,
      items: (order.items || []).map((item, index) => ({
        id: item.product?._id || item.product || item._id || `line-${index}`,
        title: item.name || item.title || "Product",
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      subtotal: Number(order.subtotal ?? order.totalAmount ?? 0),
      shippingAddress: order.shippingAddress || {},
      paymentMethod: order.paymentMethod === "cod" ? "Cash on delivery" : order.paymentMethod,
    });
  };

  const handleViewOrder = (order) => {
    const items = (order.items || []).map((item, index) => {
      const product = item.product && typeof item.product === "object"
        ? item.product
        : products.find((candidate) =>
            String(candidate._id || candidate.id) === String(item.product || item.productId)
          );
      const image =
        item.image ||
        item.productImage ||
        product?.image ||
        product?.images?.[0] ||
        "";

      return {
        id: item.product?._id || item.product || item._id || `line-${index}`,
        title: item.name || item.title || product?.title || product?.name || "Product",
        image: fileUrl(image),
        price: Number(item.price ?? product?.price ?? 0),
        quantity: Number(item.quantity || 0),
      };
    });

    setSelectedOrder({ ...order, items });
    setOrderOpened(true);
  };

  const openNav = (key) => {
    setSection(key);
    if (key === "orders") refreshOrders();
  };

  return (
    <div className="admin-page">
      <div className="admin-layout">
        {/* ── Sidebar ── */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand-mark">S</span>
            <div>
              <Text className="admin-brand-name">Singha</Text>
              <Text className="admin-brand-caption">Commerce desk</Text>
            </div>
          </div>

          <Text className="admin-nav-caption">WORKSPACE</Text>
          <nav className="admin-navigation" aria-label="Admin sections">
            {navigation.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                className={`admin-nav-item${section === key ? " is-active" : ""}`}
                aria-current={section === key ? "page" : undefined}
                onClick={() => openNav(key)}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>
                {key === "orders" && orders.length > 0 && <span className="admin-nav-count">{orders.length}</span>}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-bottom">
            <div className="admin-user-chip">
              <span className="admin-user-avatar">{user?.fullName?.charAt(0) || "A"}</span>
              <div className="admin-user-copy">
                <Text className="admin-user-name" lineClamp={1}>{user?.fullName || "Administrator"}</Text>
                <Text className="admin-user-role">Administrator</Text>
              </div>
            </div>
            <button type="button" className="admin-logout" onClick={logout}>
              <LogOut size={16} /><span>Sign out</span>
            </button>
          </div>
        </aside>

        <main className="admin-main">
          {/* ── Header ── */}
          <header className="admin-header">
            <div>
              <Text className="admin-breadcrumb">ADMIN / {sectionTitles[section].toUpperCase()}</Text>
              <Title order={1} className="admin-page-title">{sectionTitles[section]}</Title>
            </div>
            <Badge variant="light" color="teal" size="lg">Live catalog</Badge>
          </header>

          {/* ── Overview ── */}
          {section === "overview" && (
            <Stack gap="lg">
              <div className="admin-welcome">
                <div>
                  <Text className="admin-welcome-eyebrow">YOUR WORKSPACE</Text>
                  <Title order={2}>Good to see you, {user?.fullName?.split(" ")[0] || "Admin"}.</Title>
                  <Text>Here is the latest snapshot of your store.</Text>
                </div>
                <Boxes className="admin-welcome-icon" size={48} strokeWidth={1.2} />
              </div>

              <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="sm">
                <Metric label="Products" value={products.length} icon={Package} detail={`${stockCount} units in stock`} />
                <Metric label="Categories" value={categories.length} icon={Shapes} detail="Catalog groups" />
                <Metric label="Orders" value={orders.length} icon={ClipboardList} detail={ordersMessage || "All-time orders"} />
                <Metric label="Customers" value={customers.length} icon={UsersRound} detail="Registered accounts" />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="sm">
                {/* Recent orders (Order[] last 7 days) */}
                <section className="admin-surface">
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={700}>Recent orders</Text>
                      <Text size="xs" c="dimmed">Customer activity in the last 7 days</Text>
                    </div>
                    <ActionIcon variant="subtle" color="dark" aria-label="View all orders" onClick={() => setSection("orders")}>
                      <ArrowUpRight size={17} />
                    </ActionIcon>
                  </Group>
                  <Title order={1}>{recentOrderCount}</Title>
                  <Text size="sm" c="dimmed" mt={5}>orders in the last 7 days</Text>
                </section>

                {/* Inventory (Product[] price × stock) */}
                <section className="admin-surface admin-value-surface">
                  <Text className="admin-welcome-eyebrow">INVENTORY</Text>
                  <Text size="sm" c="dimmed" mt={6}>Current listed stock value</Text>
                  <Title order={2} mt={8}>{formatPrice(inventoryValue)}</Title>
                  <Text size="sm" c="dimmed" mt="xs">Across {products.length} products and {stockCount} units</Text>
                  <Button mt="lg" variant="light" color="teal" rightSection={<ArrowUpRight size={15} />} onClick={() => setSection("products")}>
                    Manage products
                  </Button>
                </section>
              </SimpleGrid>
            </Stack>
          )}

          {/* ── Products (Product[]) ── */}
          {section === "products" && <Shop adminMode />}

          {/* ── Variant Management ── */}
         
          {section === "variants" && (
            <section className="admin-surface">
              <Stack gap="lg">
                <div>
                  <Title order={2}>Variant Management</Title>
                  <Text c="dimmed" size="sm" mt={4}>
                    Manage product finishes, individual prices, stock, and SKUs.
                  </Text>
                </div>

                <Paper p="md" radius="md" withBorder>
                  <Stack gap="sm">
                    <Text fw={600}>Select a product</Text>
                    <Select
                      placeholder="Choose a product to manage"
                      searchable
                      clearable
                      data={products.map((product) => ({
                        value: String(product.id),
                        label: product.name || product.title || "Unnamed product",
                      }))}
                      value={selectedVariantProductId || null}
                      onChange={(value) =>
                        value
                          ? handleVariantProductChange(value)
                          : handleVariantProductChange("")
                      }
                    />
                    {selectedVariantProduct && (
                      <Text size="sm" c="dimmed">
                        Editing finishes for:{" "}
                        <Text span fw={600} c="dark">
                          {selectedVariantProduct.name || selectedVariantProduct.title}
                        </Text>
                      </Text>
                    )}
                  </Stack>
                </Paper>

                {selectedVariantProductId && (
                  <Stack gap="md">
                    <Group justify="space-between">
                      <div>
                        <Title order={4}>Finish variants</Title>
                        <Text c="dimmed" size="sm">
                          Each finish can have its own price, stock, SKU, and images.
                        </Text>
                      </div>
                      <Button
                        leftSection={<Plus size={16} />}
                        onClick={addFinishVariant}
                      >
                        Add finish
                      </Button>
                    </Group>

                    {variantForm.length === 0 && (
                      <Paper p="xl" radius="md" withBorder>
                        <Text ta="center" c="dimmed">
                          No finish variants yet. Click "Add finish" to create one.
                        </Text>
                      </Paper>
                    )}

                    {variantForm.map((variant, index) => (
                      <Paper key={index} p="md" radius="md" withBorder>
                        <Stack gap="md">
                          <Group justify="space-between">
                            <Text fw={700}>Variant {index + 1}</Text>
                            <ActionIcon
                              color="red"
                              variant="light"
                              aria-label={`Remove variant ${index + 1}`}
                              onClick={() => removeFinishVariant(index)}
                            >
                              <Trash2 size={16} />
                            </ActionIcon>
                          </Group>

                          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                            <TextInput
                              label="Finish / Color"
                              placeholder="e.g. Gold, Silver, Antique"
                              value={variant.finish}
                              onChange={(event) =>
                                updateVariantField(index, "finish", event.currentTarget.value)
                              }
                              required
                            />

                            <TextInput
                              label="Price (NPR)"
                              type="number"
                              min={0}
                              value={String(variant.price)}
                              onChange={(event) =>
                                updateVariantField(index, "price", event.currentTarget.value)
                              }
                              required
                            />

                            <TextInput
                              label="Stock quantity"
                              type="number"
                              min={0}
                              step={1}
                              value={String(variant.stock)}
                              onChange={(event) =>
                                updateVariantField(index, "stock", event.currentTarget.value)
                              }
                              required
                            />

                            <TextInput
                              label="SKU (optional)"
                              placeholder="e.g. BUD-GOLD-01"
                              value={variant.sku}
                              onChange={(event) =>
                                updateVariantField(index, "sku", event.currentTarget.value)
                              }
                            />

                            <Select
                              label="Availability"
                              data={[
                                { value: "true", label: "Active" },
                                { value: "false", label: "Inactive" },
                              ]}
                              value={String(variant.isActive !== false)}
                              onChange={(value) =>
                                updateVariantField(index, "isActive", value === "true")
                              }
                            />
                          </SimpleGrid>

                          <Divider />

                          <div>
                            <Text fw={600} mb="xs">Variant images</Text>
                            <Text size="xs" c="dimmed" mb="sm">
                              Upload images specific to this finish. These images can be
                              shown when customers select the finish.
                            </Text>

                            <Group align="flex-start" gap="sm">
                              {variant.images.map((image, imageIndex) => (
                                <div key={`${image}-${imageIndex}`}>
                                  <Image
                                    src={fileUrl(image)}
                                    alt={`${variant.finish || "Variant"} image ${imageIndex + 1}`}
                                    w={90}
                                    h={90}
                                    fit="contain"
                                    radius="md"
                                    withPlaceholder
                                  />
                                  <Button
                                    mt={4}
                                    size="xs"
                                    color="red"
                                    variant="subtle"
                                    onClick={() =>
                                      updateVariantField(
                                        index,
                                        "images",
                                        variant.images.filter((_, i) => i !== imageIndex)
                                      )
                                    }
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}

                              <FileButton
                                accept="image/png,image/jpeg,image/webp"
                                multiple
                                onChange={async (files) => {
                                  if (!files?.length) return;

                                  try {
                                    const uploadedImages = await Promise.all(
                                      files.map((file) => uploadImage(file))
                                    );

                                    setVariantForm((current) =>
                                      current.map((item, i) =>
                                        i === index
                                          ? {
                                              ...item,
                                              images: [...item.images, ...uploadedImages],
                                            }
                                          : item
                                      )
                                    );

                                    setVariantMessage("Variant images uploaded. Save variants to keep the changes.");
                                  } catch (error) {
                                    console.error("Variant image upload failed:", error);
                                    setVariantMessage("Image upload failed. Please try again.");
                                  }
                                }}
                              >
                                {(props) => (
                                  <Button
                                    {...props}
                                    variant="light"
                                    leftSection={<Images size={16} />}
                                  >
                                    Upload images
                                  </Button>
                                )}
                              </FileButton>
                            </Group>
                          </div>
                        </Stack>
                      </Paper>
                    ))}

                    {variantMessage && (
                      <Text
                        size="sm"
                        c={
                          variantMessage.toLowerCase().includes("successfully")
                            ? "green"
                            : variantMessage.toLowerCase().includes("uploaded")
                              ? "blue"
                              : "red"
                        }
                      >
                        {variantMessage}
                      </Text>
                    )}

                    <Group justify="flex-end">
                      <Button
                        onClick={saveFinishVariants}
                        loading={variantSaving}
                        disabled={!selectedVariantProduct}
                      >
                        Save variants
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Stack>
            </section>
          )}


          {/* ── Categories (Category[]) ── */}
          {section === "categories" && (
            <Stack gap="md">
              <Group justify="space-between" align="flex-end">
                <Stack gap={3}>
                  <Text size="xs" fw={700} tt="uppercase" c="teal.7">CATALOG ORGANIZATION</Text>
                  <Text size="sm" c="dimmed">Manage storefront categories and their descriptions.</Text>
                </Stack>
                <Button color="dark" leftSection={<Plus size={15} />} onClick={() => { setCategoryMessage(""); setCategoryModalOpened(true); }}>
                  Add category
                </Button>
              </Group>

              {categoryMessage && !categoryModalOpened && (
                <Text size="sm" c={[CATEGORY_ADDED, CATEGORY_DELETED].includes(categoryMessage) ? "teal" : "red"}>
                  {categoryMessage}
                </Text>
              )}

              <section className="admin-surface admin-table-surface">
                <Group justify="space-between" mb="md">
                  <div>
                    <Text fw={700}>Category catalog</Text>
                    <Text size="xs" c="dimmed">{categories.length} categories</Text>
                  </div>
                  <Text size="xs" c="dimmed">Product counts include hidden items</Text>
                </Group>

                {categories.length === 0 ? (
                  <Text size="sm" c="dimmed" px="md" pb="md">No categories found.</Text>
                ) : (
                  <>
                    <Table.ScrollContainer minWidth={580}>
                      <Table highlightOnHover verticalSpacing="sm" className="admin-table">
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Image</Table.Th>
                            <Table.Th>Category</Table.Th>
                            <Table.Th ta="right">Products</Table.Th>
                            <Table.Th ta="right">Actions</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {visibleCategories.map((cat) => (
                            <Table.Tr key={cat._id}>
                              <Table.Td>
                                {cat.image ? (
                                  <Image src={fileUrl(cat.image)} alt={cat.name} w={64} h={64} radius="md" fit="cover" />
                                ) : (
                                  <span className="admin-category-image-placeholder" aria-label="No category image">
                                    <Images size={24} />
                                  </span>
                                )}
                              </Table.Td>
                              <Table.Td>
                                <Stack gap={3}>
                                  <Text size="sm" fw={600}>{cat.name}</Text>
                                  <Text size="xs" c="dimmed" lineClamp={2} maw={500}>
                                    {cat.description || "No description provided."}
                                  </Text>
                                </Stack>
                              </Table.Td>
                              <Table.Td ta="right"><Text size="sm" c="dimmed">{countProducts(cat)}</Text></Table.Td>
                              <Table.Td ta="right">
                                <ActionIcon
                                  color="red"
                                  variant="subtle"
                                  aria-label={`Delete ${cat.name}`}
                                  title={`Delete ${cat.name}`}
                                  loading={categoryDeletingId === cat._id}
                                  disabled={Boolean(categoryDeletingId)}
                                  onClick={() => {
                                    setCategoryMessage("");
                                    setCategoryToDelete(cat);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </ActionIcon>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Table.ScrollContainer>
                    {categories.length > ADMIN_PAGE_SIZE && (
                      <Group justify="space-between" px="md" py="sm">
                        <Text size="xs" c="dimmed">
                          Showing {currentCategoryPage * ADMIN_PAGE_SIZE + 1}–
                          {Math.min((currentCategoryPage + 1) * ADMIN_PAGE_SIZE, categories.length)}
                          {" "}of {categories.length} categories
                        </Text>
                        <Group gap="xs">
                          <Button
                            variant="default"
                            size="xs"
                            leftSection={<ChevronLeft size={14} />}
                            disabled={currentCategoryPage === 0}
                            onClick={() => setCategoryPage(Math.max(0, currentCategoryPage - 1))}
                          >
                            Previous
                          </Button>
                          <Text size="xs" c="dimmed">{currentCategoryPage + 1} / {categoryPageCount}</Text>
                          <Button
                            variant="default"
                            size="xs"
                            rightSection={<ChevronRight size={14} />}
                            disabled={currentCategoryPage >= categoryPageCount - 1}
                            onClick={() => setCategoryPage(Math.min(categoryPageCount - 1, currentCategoryPage + 1))}
                          >
                            Next
                          </Button>
                        </Group>
                      </Group>
                    )}
                  </>
                )}
              </section>

              {/* Add-category modal (Category form) */}
              <Modal
                opened={categoryModalOpened}
                onClose={() => { setCategoryModalOpened(false); setCategoryMessage(""); }}
                centered size="lg" radius="md"
                title={
                  <div>
                    <Text size="xs" fw={700} tt="uppercase" c="teal.7">Catalog / New category</Text>
                    <Title order={3}>Add category</Title>
                  </div>
                }
              >
                <form onSubmit={handleCategorySubmit}>
                  <Stack gap="md">
                    <TextInput
                      label="Category name" placeholder="For example, Bronze statues" radius="md"
                      value={categoryName} onChange={(e) => setCategoryName(e.currentTarget.value)}
                      maxLength={60} required
                    />
                    <Textarea
                      label="Description" placeholder="Describe the pieces in this category" radius="md"
                      value={categoryDescription} onChange={(e) => setCategoryDescription(e.currentTarget.value)}
                      maxLength={300} minRows={3} maxRows={5} required
                    />

                    <div>
                      <Text size="sm" fw={500} mb={6}>Category image</Text>
                      <FileButton onChange={handleCategoryImageChange} accept="image/png,image/jpeg,image/webp,image/gif">
                        {(props) => (
                          <button
                            {...props} type="button"
                            className={`category-image-picker${categoryImagePreview ? " has-image" : ""}`}
                            aria-label={categoryImagePreview ? "Change category image" : "Choose category image"}
                          >
                            {categoryImagePreview ? (
                              <>
                                <img src={categoryImagePreview} alt="Selected category preview" />
                                <span className="category-image-picker-change"><Images size={16} />Change image</span>
                              </>
                            ) : (
                              <>
                                <Images size={32} strokeWidth={1.6} />
                                <span>Choose a category image</span>
                                <small>PNG, JPG, WebP, or GIF</small>
                              </>
                            )}
                          </button>
                        )}
                      </FileButton>
                    </div>

                    {categoryMessage && categoryMessage !== CATEGORY_ADDED && <Text size="sm" c="red">{categoryMessage}</Text>}

                    <Group justify="flex-end">
                      <Button type="button" variant="subtle" color="gray" onClick={() => setCategoryModalOpened(false)}>Cancel</Button>
                      <Button type="submit" color="dark" loading={categorySaving} leftSection={<Plus size={15} />}>Add category</Button>
                    </Group>
                  </Stack>
                </form>
              </Modal>

              <Modal
                opened={Boolean(categoryToDelete)}
                onClose={() => {
                  if (!categoryDeletingId) {
                    setCategoryToDelete(null);
                    setCategoryMessage("");
                  }
                }}
                centered
                size="sm"
                radius="md"
                title={<Title order={3}>Delete category?</Title>}
              >
                <Stack gap="md">
                  <Text>
                    Are you sure you want to delete{" "}
                    <Text span fw={700}>{categoryToDelete?.name}</Text>?
                  </Text>
                  {categoryToDelete && countProducts(categoryToDelete) > 0 && (
                    <Text c="red" size="sm">
                      {countProducts(categoryToDelete)} product(s) are assigned to
                      this category. Deleting it will not remove those products.
                    </Text>
                  )}
                  {categoryMessage && categoryMessage !== CATEGORY_DELETED && (
                    <Text c="red" size="sm">{categoryMessage}</Text>
                  )}
                  <Group justify="flex-end">
                    <Button
                      variant="default"
                      disabled={Boolean(categoryDeletingId)}
                      onClick={() => {
                        setCategoryToDelete(null);
                        setCategoryMessage("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="red"
                      loading={categoryDeletingId === categoryToDelete?._id}
                      onClick={handleCategoryDelete}
                    >
                      Delete category
                    </Button>
                  </Group>
                </Stack>
              </Modal>
            </Stack>
          )}

          {/* ── Orders (Order[]) ── */}
          {section === "orders" && (
            <section className="admin-surface admin-table-surface">
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={700}>All orders</Text>
                  <Text size="xs" c="dimmed">{orders.length} total · {formatPrice(orderTotal)} gross order value</Text>
                </div>
                <Button variant="light" color="teal" leftSection={<RefreshCw size={14} />} loading={ordersLoading} onClick={refreshOrders}>
                  Refresh
                </Button>
              </Group>

              {ordersMessage && <Text size="sm" c="red">{ordersMessage}</Text>}

              {ordersLoading && orders.length === 0 ? (
                <Text size="sm" c="dimmed">Loading orders...</Text>
              ) : orders.length === 0 ? (
                <Text ta="center" c="dimmed" py="xl">No orders found.</Text>
              ) : (
                <Stack gap="md" px="md" pb="md">
                  {orders.map((order) => (
                    <Paper key={order._id} withBorder radius="md" p="md" className="admin-order-card">
                      <Group justify="space-between" align="flex-start" mb="md" wrap="wrap">
                        <div>
                          <Text fw={700}>
                            {order.invoiceNumber || `Order-${order._id.slice(-7)}`}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {new Date(order.createdAt).toLocaleString()}
                          </Text>
                        </div>
                        <Text fw={700} size="lg">
                          {formatPrice(order.subtotal ?? order.totalAmount)}
                        </Text>
                      </Group>

                      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                        <Paper
                          withBorder
                          radius="md"
                          p="md"
                          style={{
                            borderColor: {
                              pending: "#eab308",
                              confirmed: "#3b82f6",
                              delivered: "#22c55e",
                              cancelled: "#ef4444",
                            }[normalizeOrderStatus(order.status)] || "#d1d5db",
                            borderWidth: 2,
                            transition: "border-color 0.3s ease",
                          }}
                        >
                          <Stack gap={4}>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Customer</Text>
                            <Text size="sm" fw={600}>
                              {order.shippingAddress?.fullName || order.user?.fullName || "Unknown customer"}
                            </Text>
                            <Text size="sm" c="dimmed">{order.shippingAddress?.phone || "No phone provided"}</Text>
                            <Text size="sm" c="dimmed">
                              Payment method: {order.paymentMethod || "Not specified"}
                            </Text>
                          </Stack>
                        </Paper>
                        <div>
                          <Select
                            label="Fulfillment status"
                            aria-label={`Change order ${order.invoiceNumber || order._id.slice(-7)} status`}
                            size="sm"
                            w="100%"
                            data={orderStatuses.map((status) => ({
                              value: status,
                              label: status.charAt(0).toUpperCase() + status.slice(1),
                            }))}
                            value={normalizeOrderStatus(order.status)}
                            disabled={updatingOrderId === order._id}
                            onChange={(status) =>
                              status &&
                              status !== normalizeOrderStatus(order.status) &&
                              handleOrderStatusChange(order._id, status)
                            }
                          />
                        </div>
                        <div>
                          <Select
                            label="Payment status"
                            aria-label={`Change payment status for order ${order.invoiceNumber || order._id.slice(-7)}`}
                            size="sm"
                            w="100%"
                            data={[
                              { value: "pending", label: "Pending" },
                              { value: "paid", label: "Paid" },
                            ]}
                            value={order.paymentStatus || "pending"}
                            disabled={
                              updatingPaymentOrderId === order._id ||
                              updatingOrderId === order._id
                            }
                            onChange={(paymentStatus) =>
                              paymentStatus &&
                              paymentStatus !== (order.paymentStatus || "pending") &&
                              handlePaymentStatusChange(order._id, paymentStatus)
                            }
                          />
                        </div>
                      </SimpleGrid>

                      <Divider my="md" />

                      <Group justify="flex-end" gap="sm" wrap="wrap">
                        <Button
                          variant="default"
                          leftSection={<Eye size={16} />}
                          onClick={() => handleViewOrder(order)}
                        >
                          View order
                        </Button>
                        <Button
                          variant="light"
                          leftSection={<ClipboardList size={16} />}
                          onClick={() => handleViewInvoice(order)}
                        >
                          View invoice
                        </Button>
                        <Button
                          variant="light"
                          color="red"
                          leftSection={<Trash2 size={16} />}
                          onClick={() => setOrderToDelete(order)}
                        >
                          Delete
                        </Button>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              )}
            </section>
          )}

          {/* ── Invoice modal ── */}
          <Modal
            opened={invoiceOpened}
            onClose={() => setInvoiceOpened(false)}
            centered
            size="xl"
            title={<Title order={3}>Order invoice</Title>}
            classNames={{ body: "admin-invoice-modal-body" }}
          >
            {selectedInvoice ? (
              <Invoice
                invoice={selectedInvoice}
                onDone={() => setInvoiceOpened(false)}
                doneLabel="Close"
              />
            ) : null}
          </Modal>

          {/* ── Order details modal ── */}
          <Modal
            opened={orderOpened}
            onClose={() => setOrderOpened(false)}
            centered
            size="lg"
            title={<Title order={3}>Order details</Title>}
          >
            {selectedOrder && (
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text fw={700}>
                      {selectedOrder.invoiceNumber || `Order-${selectedOrder._id.slice(-7)}`}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </Text>
                  </div>
                  <Badge
                    color={getOrderStatusColor(selectedOrder.status)}
                    variant="light"
                    tt="capitalize"
                  >
                    {normalizeOrderStatus(selectedOrder.status)}
                  </Badge>
                </Group>

                <Group gap="xs">
                  <Text size="sm" fw={600}>Payment method:</Text>
                  <Text size="sm">{selectedOrder.paymentMethod || "Not specified"}</Text>
                  <Badge
                    color={selectedOrder.paymentStatus === "paid" ? "green" : "yellow"}
                    variant="light"
                    tt="capitalize"
                  >
                    {selectedOrder.paymentStatus || "pending"}
                  </Badge>
                </Group>

                <Paper withBorder radius="md" p="sm">
                  <Text fw={600}>
                    {selectedOrder.shippingAddress?.fullName ||
                      selectedOrder.user?.fullName ||
                      "Unknown customer"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {selectedOrder.shippingAddress?.phone || "No phone provided"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {[
                      selectedOrder.shippingAddress?.address,
                      selectedOrder.shippingAddress?.city,
                      selectedOrder.shippingAddress?.state,
                      selectedOrder.shippingAddress?.postalCode,
                    ].filter(Boolean).join(", ") || "No delivery address provided"}
                  </Text>
                </Paper>

                <Stack gap="sm">
                  <Text fw={600}>Items</Text>
                  {selectedOrder.items.length ? selectedOrder.items.map((item) => (
                    <Group key={item.id} wrap="nowrap" align="center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          w={72}
                          h={72}
                          radius="sm"
                          fit="cover"
                        />
                      ) : (
                        <Paper
                          w={72}
                          h={72}
                          radius="sm"
                          withBorder
                          c="dimmed"
                          style={{ display: "grid", placeItems: "center", flexShrink: 0 }}
                        >
                          <Package size={24} />
                        </Paper>
                      )}
                      <Stack gap={2} style={{ flex: 1 }}>
                        <Text fw={500}>{item.title}</Text>
                        <Text size="sm" c="dimmed">
                          {formatPrice(item.price)} × {item.quantity}
                        </Text>
                      </Stack>
                      <Text fw={600}>
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                    </Group>
                  )) : (
                    <Text size="sm" c="dimmed">No items are available for this order.</Text>
                  )}
                </Stack>

                <Group justify="space-between" pt="sm" style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}>
                  <Text fw={700}>Total</Text>
                  <Text fw={700}>
                    {formatPrice(selectedOrder.subtotal ?? selectedOrder.totalAmount)}
                  </Text>
                </Group>
              </Stack>
            )}
          </Modal>

          {/* ── Delete order modal ── */}
          <Modal
            opened={Boolean(orderToDelete)}
            onClose={() => {
              if (!deletingOrderId) setOrderToDelete(null);
            }}
            centered
            size="sm"
            radius="md"
            title={<Title order={3}>Delete order?</Title>}
          >
            <Stack gap="md">
              <Text>
                Are you sure you want to delete{" "}
                <Text span fw={700}>
                  {orderToDelete?.invoiceNumber || "this order"}
                </Text>
                ? This can't be undone.
              </Text>
              <Group justify="flex-end">
                <Button
                  variant="default"
                  disabled={Boolean(deletingOrderId)}
                  onClick={() => setOrderToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  loading={Boolean(deletingOrderId)}
                  onClick={handleOrderDelete}
                >
                  Delete order
                </Button>
              </Group>
            </Stack>
          </Modal>

          {/* ── Customers (Customer[]) ── */}
          {section === "customers" && (
            <section className="admin-surface admin-table-surface">
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={700}>Customer accounts</Text>
                  <Text size="xs" c="dimmed">{customers.length} registered customers</Text>
                </div>
              </Group>

              {customersMessage ? (
                <Text size="sm" c="red">{customersMessage}</Text>
              ) : (
                <Table.ScrollContainer minWidth={560}>
                  <Table highlightOnHover verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Customer</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th ta="right">Orders</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {customers.map((c) => (
                        <Table.Tr key={c._id}>
                          <Table.Td>
                            <Group gap="sm" wrap="nowrap">
                              <Image src={fileUrl(c.avatar) || undefined} alt="" w={34} h={34} radius="xl" />
                              <Text size="sm" fw={600}>{c.fullName}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td><Text size="sm">{c.email}</Text></Table.Td>
                          <Table.Td>
                            <Badge color={c.role === "admin" ? "teal" : "gray"} variant="light" tt="capitalize">{c.role}</Badge>
                          </Table.Td>
                          <Table.Td ta="right">
                            <Text size="sm">{orders.filter((o) => String(o.user?._id) === String(c._id)).length}</Text>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                      {customers.length === 0 && (
                        <Table.Tr>
                          <Table.Td colSpan={4}><Text ta="center" c="dimmed" py="xl">No customers found.</Text></Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

// ── Metric card: { label, value, icon, detail } ──
const Metric = ({ label, value, icon: Icon, detail }) => (
  <Paper className="admin-metric" p="md">
    <Group justify="space-between" align="flex-start">
      <Stack gap={5}>
        <Text className="admin-metric-label">{label}</Text>
        <Text className="admin-metric-value">{value}</Text>
      </Stack>
      <Icon size={18} color="#4f7b6c" strokeWidth={1.8} />
    </Group>
    <Text size="xs" c="dimmed" mt="sm" lineClamp={1}>{detail}</Text>
  </Paper>
);

export default AdminDashboard;