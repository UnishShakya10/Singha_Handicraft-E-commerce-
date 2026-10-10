import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Alert, Button, Container, Stack, Text, Title } from "@mantine/core";
import { api } from "../lib/api";
import Invoice from "../component/Invoice";

const toInvoice = (order) => ({
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
  paymentMethod:
    order.paymentMethod === "cod" ? "Cash on delivery" : order.paymentMethod,
});

const InvoicePage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadInvoice = async () => {
      setLoading(true);
      setInvoice(null);
      setNotFound(false);
      setError("");

      try {
        const { data: order } = await api.get(
          `/orders/${encodeURIComponent(orderId || "")}`
        );
        if (active) setInvoice(toInvoice(order));
      } catch (requestError) {
        if (!active) return;

        if ([400, 404].includes(requestError.response?.status)) {
          setNotFound(true);
        } else {
          setError(
            requestError.response?.data?.message ||
              "Could not load this invoice. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInvoice();
    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <Container size="md" py={64}>
      <Stack gap="lg">
        {loading && <Text c="dimmed">Loading invoice...</Text>}

        {!loading && notFound && (
          <Stack align="center" ta="center" gap="md">
            <Title order={1}>Invoice not found</Title>
            <Text c="dimmed">
              This invoice may not exist or may not be available to your account.
            </Text>
            <Button component={Link} to="/orders" color="dark">
              Back to your orders
            </Button>
          </Stack>
        )}

        {!loading && error && <Alert color="red">{error}</Alert>}

        {!loading && invoice && (
          <>
            <Alert color="yellow" title="Keep a copy">
              Please download and save a PDF copy of this invoice for your records.
            </Alert>
            <Invoice
              invoice={invoice}
              onDone={() => navigate("/shop")}
              doneLabel="Continue shopping"
            />
          </>
        )}
      </Stack>
    </Container>
  );
};

export default InvoicePage;
