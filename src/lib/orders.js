import { fileUrl, fixUrl } from "./api";

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f1ede2'/></svg>"
  );

export const normalizeStatus = (status) =>
  ({
    placed: "pending",
    processing: "confirmed",
    shipped: "confirmed",
  })[status] ||
  status ||
  "pending";

export const STATUS_COLORS = {
  pending: "yellow",
  confirmed: "blue",
  delivered: "green",
  cancelled: "red",
};

export const STATUS_STEPS = ["pending", "confirmed", "delivered"];

const pick = (...values) =>
  values.find((v) => v !== undefined && v !== null && v !== "");

const toUrl = (img) => {
  const raw = typeof img === "string" ? img : img?.url || img?.src || "";
  return raw ? fixUrl(fileUrl(raw)) : "";
};

export const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

export const formatAddress = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address;
  return Object.values(address).filter(Boolean).join(", ");
};

export const normalizeOrder = (order, products = []) => {
  const rawItems = pick(order.items, order.orderItems, order.products, []);

  const items = rawItems.map((item, index) => {
    const productRef =
      item.product && typeof item.product === "object" ? item.product : null;
    const productId = String(
      pick(productRef?._id, item.product, item.productId, "")
    );
    const itemTitle = pick(item.title, item.name, productRef?.name, "");

    const catalog =
      products.find((p) => productId && String(p.id) === productId) ||
      products.find(
        (p) =>
          itemTitle &&
          String(p.title).toLowerCase() === String(itemTitle).toLowerCase()
      );

    const finish = pick(
      item.selectedVariant?.finish,
      item.finish,
      item.variant?.finish,
      ""
    );
    const variantId = String(
      pick(item.selectedVariant?.id, item.variantId, item.variant?._id, "")
    );

    const variant = catalog?.variants?.find(
      (v) =>
        (variantId && String(v._id || v.id) === variantId) ||
        (finish &&
          String(v.finish || "").toLowerCase() === String(finish).toLowerCase())
    );

    return {
      key: String(item._id || item.id || `${productId}-${finish}-${index}`),
      title: pick(itemTitle, catalog?.title, "Product"),
      finish,
      quantity: Number(pick(item.quantity, item.qty, 1)),
      price: Number(
        pick(
          item.price,
          item.unitPrice,
          item.selectedVariant?.price,
          variant?.price,
          catalog?.price,
          0
        )
      ),
      image: toUrl(
        pick(
          item.image,
          item.images?.[0],
          variant?.images?.[0],
          productRef?.images?.[0],
          productRef?.image,
          catalog?.images?.[0],
          catalog?.image
        )
      ),
    };
  });

  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const id = String(order._id || order.id);

  return {
    id,
    label: order.invoiceNumber || `Order ${id.slice(-8)}`,
    createdAt: order.createdAt,
    status: normalizeStatus(order.status),
    items,
    itemsTotal,
    total: Number(pick(order.subtotal, order.totalAmount, itemsTotal)),
    address: formatAddress(
      pick(order.shippingAddress, order.address, order.deliveryAddress)
    ),
    phone: pick(order.phone, order.shippingAddress?.phone, ""),
    paymentMethod: pick(order.paymentMethod, order.payment?.method, ""),
  };
};