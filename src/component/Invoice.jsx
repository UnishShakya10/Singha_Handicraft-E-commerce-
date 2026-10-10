import { Button, Divider, Group, Stack, Table, Text, Title } from "@mantine/core";
import { Printer } from "lucide-react";
import { formatPrice } from "../lib/api";

const Invoice = ({ invoice, onDone, doneLabel = "Continue shopping" }) => {
  const { number, date, items, subtotal, shippingAddress: a, paymentMethod } = invoice;

  return (
    <Stack gap="md">
      <Group justify="flex-end" className="no-print">
        <Button variant="default" onClick={onDone}>{doneLabel}</Button>
        <Button color="dark" leftSection={<Printer size={16} />} onClick={() => window.print()}>
          Print / Save PDF
        </Button>
      </Group>

      <div className="invoice-print" style={{ background: "white", padding: 32, color: "#111" }}>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>Singha Handicraft</Title>
            <Text size="sm" c="dimmed">Lalitpur, Nepal</Text>
            <Text size="sm" c="dimmed">+977 9860684495 · shakyayubraj4@gmail.com</Text>
          </div>
          <div style={{ textAlign: "right" }}>
            <Title order={3}>INVOICE</Title>
            <Text size="sm">No: {number}</Text>
            <Text size="sm">Date: {new Date(date).toLocaleDateString("en-GB")}</Text>
          </div>
        </Group>

        <Divider my="lg" />

        <Text size="xs" fw={700} tt="uppercase" c="dimmed">Bill to</Text>
        <Text fw={600}>{a.fullName}</Text>
        <Text size="sm">{a.phone}</Text>
        <Text size="sm">
          {[a.address, a.city, a.state, a.postalCode].filter(Boolean).join(", ")}
        </Text>

        <Table mt="lg" verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item</Table.Th>
              <Table.Th ta="right">Price</Table.Th>
              <Table.Th ta="right">Qty</Table.Th>
              <Table.Th ta="right">Amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.title}</Table.Td>
                <Table.Td ta="right">{formatPrice(item.price)}</Table.Td>
                <Table.Td ta="right">{item.quantity}</Table.Td>
                <Table.Td ta="right">{formatPrice(item.price * item.quantity)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Divider my="md" />
        <Group justify="space-between">
          <Text fw={700}>Total</Text>
          <Text fw={700} size="lg">{formatPrice(subtotal)}</Text>
        </Group>
        <Text size="sm" c="dimmed" mt="xs">Payment: {paymentMethod}</Text>
        <Text size="xs" c="dimmed" mt="xl">Thank you for your order. We will contact you to confirm delivery.</Text>
      </div>
    </Stack>
  );
};

export default Invoice;