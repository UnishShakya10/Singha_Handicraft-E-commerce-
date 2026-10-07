import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { ActionIcon, Alert, Button, Container, FileButton, Group, Image, Modal, Select, SimpleGrid, Stack, Switch, Table, Text, Textarea, TextInput, Title } from "@mantine/core";
import { ChevronLeft, ChevronRight, Images, Pencil, Plus, Trash2 } from "lucide-react";
import Cards from "../component/Cards";
import { featuredCollections } from "../data/products";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../lib/api";

const emptyForm = {
  title: "",
  category: "",
  collection: "new",
  price: "",
  stock: "1",
  material: "",
  dimensionsCm: "",
  dimensionsInches: "",
  image: "/Manjushree.webp",
  imageFile: null,
  extraImageFiles: [],
  // new fields
  description: "",
  iconography: "",
  significance: "",
};

const convertDimensions = (value, fromUnit, toUnit) => {
  const numbers = value.match(/\d+(?:\.\d+)?/g);
  if (!numbers) return "";

  return numbers
    .map((number) => {
      const converted = Number(number) * (fromUnit === "cm" ? 1 / 2.54 : 2.54);
      const decimals = toUnit === "cm" ? 0 : 1;
      return Number(converted.toFixed(decimals));
    })
    .join(" x ") + ` ${toUnit}`;
};

const normalizeCategory = (value = "") =>
  String(value).trim().toLowerCase().replace(/\s+/g, " ");

const ADMIN_PAGE_SIZE = 10;

const Shop = ({ adminMode = false }) => {
  const { products, categories, addProduct, updateProduct, removeProduct, uploadImage } = useProducts();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category")?.trim() || "";
  const selectedCategoryData = categories.find(
    (category) => normalizeCategory(category.name) === normalizeCategory(selectedCategory)
  );
  const showManagement = adminMode;
  const catalogProducts = showManagement ? products : products.filter((product) => product.isActive !== false);
  const visibleProducts = selectedCategory
    ? catalogProducts.filter(
        (product) => normalizeCategory(product.category) === normalizeCategory(selectedCategory)
      )
    : catalogProducts;
  const [opened, setOpened] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [productDeletingId, setProductDeletingId] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [productPage, setProductPage] = useState(0);
  const productPageCount = Math.max(1, Math.ceil(products.length / ADMIN_PAGE_SIZE));
  const currentProductPage = Math.min(productPage, productPageCount - 1);
  const visibleAdminProducts = products.slice(
    currentProductPage * ADMIN_PAGE_SIZE,
    (currentProductPage + 1) * ADMIN_PAGE_SIZE
  );
  const imagePreview = editingProduct || form.imageFile ? form.image : "";
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleImageFile = (file) => {
    if (!file) return;
    updateField("imageFile", file);
    const reader = new FileReader();
    reader.onload = () => updateField("image", reader.result);
    reader.readAsDataURL(file);
  };

  const handleExtraImageFiles = (files) => {
    const selectedFiles = Array.from(files || []);
    if (selectedFiles.length === 0) return;

    setForm((current) => ({
      ...current,
      extraImageFiles: [...current.extraImageFiles, ...selectedFiles],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSavingProduct(true);
    setProductMessage("");

    try {
      const image = form.imageFile ? await uploadImage(form.imageFile) : form.image;
      const uploadedExtraImages = await Promise.all(
        form.extraImageFiles.map((file) => uploadImage(file))
      );

      const productData = {
        name: form.title,
        slug: editingProduct?.slug || `${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        price: Number(form.price),
        stock: Number(form.stock),
        images: image
          ? [image, ...uploadedExtraImages]
          : uploadedExtraImages,
        category: form.category,
        collection: form.collection,
        material: form.material,
        description:
          form.description.trim() ||
          `${form.title}, handcrafted for collectors and devotional spaces.`,
        iconography: form.iconography.trim(),
        significance: form.significance.trim(),
        origin: editingProduct?.origin || "Patan, Nepal",
        finishTime: editingProduct?.finishTime || "Made to order",
        isActive: editingProduct ? editingProduct.isActive !== false : true,
        height: form.dimensionsCm || form.dimensionsInches
          ? `${form.dimensionsCm}\n|\n${form.dimensionsInches}`
          : editingProduct?.height || "",
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      setForm(emptyForm);
      setEditingProduct(null);
      setOpened(false);
    } catch (error) {
      setProductMessage(error.response?.data?.message || "Could not save this product.");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    const [dimensionsCm = "", dimensionsInches = ""] = String(product.height || "")
      .split("|")
      .map((dimension) => dimension.trim());
    const categoryId = product.categoryId || categories.find((category) => (
      category.name.toLocaleLowerCase() === String(product.category || "").toLocaleLowerCase()
    ))?._id || product.category;

    setEditingProduct(product);
    setProductMessage("");
    setForm({
      ...emptyForm,
      title: product.title || product.name || "",
      category: categoryId || "",
      collection: product.collection || "new",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0),
      material: product.material || "",
      dimensionsCm,
      dimensionsInches,
      image: product.image || product.images?.[0] || "",
      // new fields
      description: product.description || "",
      iconography: product.iconography || "",
      significance: product.significance || "",

    });
    setOpened(true);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setProductMessage("");
    setForm(emptyForm);
    setOpened(true);
  };

  const handleProductVisibilityChange = async (product, isActive) => {
    setUpdatingProductId(product.id);
    setProductMessage("");
    try {
      await updateProduct(product.id, { isActive });
    } catch (error) {
      setProductMessage(error.response?.data?.message || "Could not update product visibility.");
    } finally {
      setUpdatingProductId("");
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    const product = productToDelete;

    setProductDeletingId(product.id);
    setProductMessage("");

    try {
      await removeProduct(product.id);
      setProductToDelete(null);
      setProductMessage("Product deleted successfully.");
    } catch (error) {
      setProductMessage(
        error.response?.data?.message || "Could not delete product."
      );
    } finally {
      setProductDeletingId("");
    }
  };

  return (
    <div className={showManagement ? "admin-product-panel" : "min-h-screen bg-paper py-16"}>
      {showManagement ? (
        <Container size="xl" py="md">
          <Group justify="space-between" align="center" mb="md">
            <Stack gap={2}>
              <Title order={2} className="admin-title">Products</Title>
              <Text size="sm" c="dimmed">Manage the items available in your collection.</Text>
            </Stack>
            <Button color="dark" leftSection={<Plus size={16} />} onClick={handleOpenCreate}>
              Add product
            </Button>
          </Group>
          <section className="admin-inventory">
            <Group justify="space-between" px="md" py="sm" className="admin-inventory-heading">
              <Text fw={700} size="sm">All products <Text span c="dimmed" fw={400}>({products.length})</Text></Text>
              <Text size="xs" c="dimmed">Prices in NPR</Text>
            </Group>
            {productMessage && !productToDelete && (
              <Alert
                color={productMessage === "Product deleted successfully." ? "teal" : "red"}
                m="md"
              >
                {productMessage}
              </Alert>
            )}
            <Table.ScrollContainer minWidth={760}>
              <Table verticalSpacing="sm" highlightOnHover className="admin-table">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Collection</Table.Th>
                    <Table.Th>Stock</Table.Th>
                    <Table.Th ta="right">Price</Table.Th>
                    <Table.Th>Website</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {visibleAdminProducts.map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>
                        <Group gap="sm" wrap="nowrap">
                          <Image src={product.image} alt="" w={44} h={44} radius="sm" fit="cover" />
                          <Stack gap={2}>
                            <Text size="sm" fw={600} lineClamp={1}>{product.title}</Text>
                            <Text size="xs" c="dimmed">{product.material || "Handcrafted"}</Text>
                          </Stack>
                        </Group>
                      </Table.Td>
                      <Table.Td><Text size="sm">{product.category || "Uncategorized"}</Text></Table.Td>
                      <Table.Td><Text size="sm" tt="capitalize">{product.collection || "new"}</Text></Table.Td>
                      <Table.Td>
                        <Text size="sm" c={Number(product.stock || 0) > 0 ? "dark" : "red"}>
                          {Number(product.stock || 0)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right"><Text size="sm" fw={600}>{formatPrice(product.price)}</Text></Table.Td>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          <Switch
                            checked={product.isActive !== false}
                            disabled={updatingProductId === product.id}
                            aria-label={`${product.isActive !== false ? "Hide" : "Show"} ${product.title} on website`}
                            onChange={(event) => handleProductVisibilityChange(product, event.currentTarget.checked)}
                          />
                          <Text size="xs" c={product.isActive !== false ? "teal" : "dimmed"}>
                            {product.isActive !== false ? "Visible" : "Hidden"}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} justify="flex-end" wrap="nowrap">
                          <ActionIcon variant="subtle" color="dark" aria-label={`Edit ${product.title}`} onClick={() => handleEditProduct(product)}>
                            <Pencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label={`Delete ${product.title}`}
                            title={`Delete ${product.title}`}
                            loading={productDeletingId === product.id}
                            disabled={Boolean(productDeletingId)}
                            onClick={() => {
                              setProductMessage("");
                              setProductToDelete(product);
                            }}
                          >
                            <Trash2 size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {products.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={7}><Text ta="center" c="dimmed" py="xl">No products found.</Text></Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            {products.length > ADMIN_PAGE_SIZE && (
                <Group justify="space-between" px="md" py="sm" className="admin-inventory-pagination">
                  <Text size="xs" c="dimmed">
                    Showing {currentProductPage * ADMIN_PAGE_SIZE + 1}–
                    {Math.min((currentProductPage + 1) * ADMIN_PAGE_SIZE, products.length)}
                    {" "}of {products.length} products
                  </Text>
                  <Group gap="xs">
                    <Button
                      variant="default"
                      size="xs"
                      leftSection={<ChevronLeft size={14} />}
                      disabled={currentProductPage === 0}
                      onClick={() => setProductPage(Math.max(0, currentProductPage - 1))}
                    >
                      Previous
                    </Button>
                    <Text size="xs" c="dimmed">{currentProductPage + 1} / {productPageCount}</Text>
                    <Button
                      variant="default"
                      size="xs"
                      rightSection={<ChevronRight size={14} />}
                      disabled={currentProductPage >= productPageCount - 1}
                      onClick={() => setProductPage(Math.min(productPageCount - 1, currentProductPage + 1))}
                    >
                      Next
                    </Button>
                  </Group>
                </Group>
            )}
          </section>
        </Container>
      ) : (
        <>
          <Container size="xl" mb={64}>
            <Group justify="space-between" align="flex-end" mb="xl">
              <Stack gap={6}>
                <Text size="xs" fw={600} tt="uppercase" lts={4} c="gold.6">The collection</Text>
                <Title order={1} mt="sm" c="dark">{selectedCategory || "Sacred sculpture"}</Title>
              </Stack>
            </Group>
            <Text c="dimmed" maw={560} mt="md">
              {selectedCategoryData?.description?.trim() ||
                "Hand-finished Buddhist statues in copper and bronze. Prices are in Nepalese rupees; international shipping is arranged on request."}
            </Text>
          </Container>

          {featuredCollections.map((section) => {
            const sectionProducts = visibleProducts.filter((product) => product.collection === section.id);
            if (selectedCategory && sectionProducts.length === 0) return null;
            return (
              <ProductSection
                key={section.id}
                title={section.title}
                description={section.description}
                products={sectionProducts}
              />
            );
          })}
          {selectedCategory && visibleProducts.length === 0 && (
            <Container size="xl" py="xl">
              <Text c="dimmed">No products found in this category.</Text>
            </Container>
          )}
        </>
      )}

      {showManagement && (
        <>
          <Modal
            opened={opened}
            onClose={() => {
              setOpened(false);
              setEditingProduct(null);
              setProductMessage("");
            }}
            title={(
              <div>
                <Text size="xs" fw={700} tt="uppercase" c="teal.7">Catalog / {editingProduct ? "Edit item" : "New item"}</Text>
                <Title order={3}>{editingProduct ? "Edit product" : "Add product"}</Title>
              </div>
            )}
            centered
            size="xl"
            radius="sm"
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
            classNames={{ body: "product-editor-modal-body" }}
          >
            <form className="product-editor-layout" onSubmit={handleSubmit}>
              {productMessage && !productToDelete && (
                <Alert color="red" className="product-editor-message">{productMessage}</Alert>
              )}
            <div className="product-editor-fields">
              <section className="product-editor-section">
                <div>
                  <Text fw={700}>Product details</Text>
                  <Text size="xs" c="dimmed">Name, material, price, and measurements.</Text>
                </div>
                <TextInput
                  label="Product name"
                  placeholder="Name this piece"
                  required
                  value={form.title}
                  onChange={(event) => updateField("title", event.currentTarget.value)}
                />
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                  <TextInput label="Price (NPR)" type="number" min={1} required value={form.price} onChange={(event) => updateField("price", event.currentTarget.value)} />
                  <TextInput label="Stock quantity" type="number" min={0} step={1} required value={form.stock} onChange={(event) => updateField("stock", event.currentTarget.value)} />
                  <TextInput label="Material" placeholder="Copper, bronze..." required value={form.material} onChange={(event) => updateField("material", event.currentTarget.value)} />
                </SimpleGrid>
                <Group grow align="flex-start">
                  <TextInput
                    label="Dimensions (cm)"
                    placeholder="25 x 20"
                    required
                    value={form.dimensionsCm}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setForm((current) => ({
                        ...current,
                        dimensionsCm: value,
                        dimensionsInches: convertDimensions(value, "cm", "in"),
                      }));
                    }}
                  />
                  <TextInput
                    label="Dimensions (in)"
                    placeholder="9.8 x 7.9"
                    required
                    value={form.dimensionsInches}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setForm((current) => ({
                        ...current,
                        dimensionsInches: value,
                        dimensionsCm: convertDimensions(value, "in", "cm"),
                      }));
                    }}
                  />
                </Group>
              </section>

              {/* NEW: product story */}
              <section className="product-editor-section">
                <div>
                  <Text fw={700}>Product story</Text>
                  <Text size="xs" c="dimmed">Shown in the tabs on the product page. Write in your own words.</Text>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Size, materials, how it is made..."
                  minRows={4}
                  autosize
                  value={form.description}
                  onChange={(event) => updateField("description", event.currentTarget.value)}
                />
                <Textarea
                  label="Iconography"
                  placeholder="Posture, hand gestures, what the details mean..."
                  minRows={3}
                  autosize
                  value={form.iconography}
                  onChange={(event) => updateField("iconography", event.currentTarget.value)}
                />
                <Textarea
                  label="Spiritual significance"
                  placeholder="What this deity represents..."
                  minRows={3}
                  autosize
                  value={form.significance}
                  onChange={(event) => updateField("significance", event.currentTarget.value)}
                />
              </section>

              <section className="product-editor-section">
                <div>
                  <Text fw={700}>Organization</Text>
                  <Text size="xs" c="dimmed">Choose where customers will find this item.</Text>
                </div>
                <Group grow align="flex-start">
                  <Select
                    label="Category"
                    data={categories.map((category) => ({ value: category._id, label: category.name }))}
                    value={form.category}
                    onChange={(value) => updateField("category", value)}
                    searchable
                    required
                  />
                  <Select
                    label="Collection"
                    data={[
                      { value: "best-sellers", label: "Best Sellers" },
                      { value: "new", label: "New Additions" },
                      { value: "classics", label: "Sacred Classics" },
                    ]}
                    value={form.collection}
                    onChange={(value) => updateField("collection", value)}
                  />
                </Group>
              </section>

              <section className="product-editor-section">
                <div>
                  <Text fw={700}>Product image</Text>
                  <Text size="xs" c="dimmed">
                    Choose an image file to upload.
                  </Text>
                </div>
                <div>
                  <Text size="sm" fw={500} mb={6}>Upload an image</Text>
                  <FileButton
                    onChange={handleImageFile}
                    accept="image/png,image/jpeg,image/webp,image/gif"
                  >
                    {(props) => (
                      <button
                        {...props}
                        type="button"
                        className={`category-image-picker product-image-picker${imagePreview ? " has-image" : ""}`}
                        aria-label={imagePreview ? "Change product image" : "Choose product image"}
                      >
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Product image preview" />
                            <span className="category-image-picker-change">
                              <Images size={16} />
                              Change image
                            </span>
                          </>
                        ) : (
                          <>
                            <Images size={34} strokeWidth={1.6} />
                            <span>Choose a product image</span>
                            <small>PNG, JPG, WebP, or GIF; 10 MB max</small>
                          </>
                        )}
                      </button>
                    )}
                  </FileButton>
                </div>

                <div>
                  <Text size="sm" fw={500} mb={6}>Upload gallery images</Text>
                  <Text size="xs" c="dimmed" mb="xs">
                    Select multiple images at once, or choose more images again to add them.
                  </Text>
                  <FileButton
                    onChange={handleExtraImageFiles}
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                  >
                    {(props) => (
                      <Button {...props} type="button" variant="light" color="dark">
                        Choose gallery images
                      </Button>
                    )}
                  </FileButton>
                  {form.extraImageFiles.length > 0 && (
                    <Text size="xs" c="dimmed" mt="xs">
                      {form.extraImageFiles.map((file) => file.name).join(", ")}
                    </Text>
                  )}
                </div>
              </section>
            </div>

            <aside className="product-editor-preview">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">Preview</Text>
              <Image
                src={form.image}
                alt={form.title ? `${form.title} preview` : "Product preview"}
                h={250}
                fit="contain"
                radius="sm"
                bg="white"
              />
              <Stack gap={5}>
                <Text size="xs" tt="uppercase" c="teal.7" fw={700}>{form.material || "Material"}</Text>
                <Text fw={700} size="lg">{form.title || "Product name"}</Text>
                <Text size="sm" c="dimmed">{categories.find((category) => category._id === form.category)?.name || "Category"}</Text>
                <Text fw={700} size="lg">{form.price ? formatPrice(form.price) : "Price"}</Text>
              </Stack>
              <div className="product-editor-actions">
                <Button type="submit" color="dark" fullWidth loading={savingProduct}>
                  {editingProduct ? "Save changes" : "Save product"}
                </Button>
                <Button type="button" variant="subtle" color="gray" fullWidth onClick={() => setOpened(false)}>
                  Cancel
                </Button>
              </div>
            </aside>
            </form>
          </Modal>

          <Modal
            opened={Boolean(productToDelete)}
            onClose={() => {
              if (!productDeletingId) {
                setProductToDelete(null);
                setProductMessage("");
              }
            }}
            centered
            size="sm"
            radius="md"
            title={<Title order={3}>Delete product?</Title>}
          >
            <Stack gap="md">
              <Text>
                Are you sure you want to delete{" "}
                <Text span fw={700}>{productToDelete?.title}</Text>?
                {" "}This action cannot be undone.
              </Text>
              {productMessage && productMessage !== "Product deleted successfully." && (
                <Alert color="red">{productMessage}</Alert>
              )}
              <Group justify="flex-end">
                <Button
                  variant="default"
                  disabled={Boolean(productDeletingId)}
                  onClick={() => {
                    setProductToDelete(null);
                    setProductMessage("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  loading={productDeletingId === productToDelete?.id}
                  onClick={handleDeleteProduct}
                >
                  Delete product
                </Button>
              </Group>
            </Stack>
          </Modal>
        </>
      )}
    </div>
  );
};

const ProductSection = ({ title, description, products }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  return (
    <Container size="xl" mb={80}>
      <Group justify="space-between" align="flex-end" mb="lg">
        <Stack gap={6}>
          <Title order={2}>{title}</Title>
          <Text c="dimmed" maw={560}>
            {description}
          </Text>
        </Stack>
        <Group gap="xs" visibleFrom="md">
          <ActionIcon variant="default" radius="xl" size="lg" onClick={() => scroll("left")}>
            <ChevronLeft size={18} />
          </ActionIcon>
          <ActionIcon variant="default" radius="xl" size="lg" onClick={() => scroll("right")}>
            <ChevronRight size={18} />
          </ActionIcon>
        </Group>
      </Group>

      <div ref={scrollRef} className="no-scrollbar flex gap-6 overflow-x-auto pb-2">
        {products.map((product) => (
          <div key={product.id} className="min-w-[300px] flex-shrink-0">
            <Cards product={product} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Shop;