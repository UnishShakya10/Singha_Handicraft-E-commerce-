import { useState } from "react";
import { Alert, Button, Divider, Group, Stack, Table, Text, Title } from "@mantine/core";
import { Download, Printer } from "lucide-react";
import { formatPrice } from "../lib/api";

const Invoice = ({ invoice, onDone, doneLabel = "Continue shopping" }) => {
  const { number, date, items, subtotal, shippingAddress: a, paymentMethod } = invoice;
  const [downloadError, setDownloadError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 18;
      const money = (amount) => `NPR ${Number(amount || 0).toLocaleString("en-NP")}`;
      let y = 20;

      const drawTableHeading = () => {
        pdf.setFillColor(247, 243, 234);
        pdf.rect(margin, y - 5, pageWidth - margin * 2, 10, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(55, 45, 31);
        pdf.text("Item", margin + 2, y + 1);
        pdf.text("Price", 126, y + 1, { align: "right" });
        pdf.text("Qty", 153, y + 1, { align: "right" });
        pdf.text("Amount", pageWidth - margin - 2, y + 1, { align: "right" });
        y += 12;
      };

      pdf.setFillColor(20, 17, 13);
      pdf.rect(0, 0, pageWidth, 42, "F");
      pdf.setTextColor(201, 162, 39);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("SINGHA HANDICRAFT", margin, 19);
      pdf.setFontSize(10);
      pdf.setTextColor(245, 241, 232);
      pdf.setFont("helvetica", "normal");
      pdf.text("Lalitpur, Nepal  |  +977 9860684495", margin, 28);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("INVOICE", pageWidth - margin, 18, { align: "right" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(`No: ${number}`, pageWidth - margin, 26, { align: "right" });
      pdf.text(
        `Date: ${new Date(date).toLocaleDateString("en-GB")}`,
        pageWidth - margin,
        33,
        { align: "right" }
      );

      y = 54;
      pdf.setTextColor(115, 91, 34);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("BILL TO", margin, y);
      y += 7;
      pdf.setTextColor(25, 25, 25);
      pdf.setFontSize(11);
      pdf.text(a.fullName || "", margin, y);
      y += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(a.phone || "", margin, y);
      y += 5;
      const address = [a.address, a.city, a.state, a.postalCode]
        .filter(Boolean)
        .join(", ");
      const addressLines = pdf.splitTextToSize(address, pageWidth - margin * 2);
      pdf.text(addressLines, margin, y);
      y += addressLines.length * 5 + 9;

      drawTableHeading();
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(35, 35, 35);

      items.forEach((item) => {
        const titleLines = pdf.splitTextToSize(item.title || "Product", 91);
        const rowHeight = Math.max(8, titleLines.length * 5);
        if (y + rowHeight > pageHeight - 28) {
          pdf.addPage();
          y = 20;
          drawTableHeading();
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(35, 35, 35);
        }

        pdf.text(titleLines, margin + 2, y);
        pdf.text(money(item.price), 126, y, { align: "right" });
        pdf.text(String(item.quantity), 153, y, { align: "right" });
        pdf.text(
          money(Number(item.price) * Number(item.quantity)),
          pageWidth - margin - 2,
          y,
          { align: "right" }
        );
        y += rowHeight;
        pdf.setDrawColor(225, 219, 207);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 5;
      });

      if (y + 28 > pageHeight - margin) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(25, 25, 25);
      pdf.text("Total", margin, y + 5);
      pdf.text(money(subtotal), pageWidth - margin, y + 5, { align: "right" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(`Payment: ${paymentMethod || "Cash on delivery"}`, margin, y + 13);
      pdf.setTextColor(115, 91, 34);
      pdf.text(
        "Thank you for your order. We will contact you to confirm delivery.",
        margin,
        y + 21
      );

      const safeNumber = String(number || "invoice").replace(/[^a-z0-9-]/gi, "-");
      pdf.save(`${safeNumber}.pdf`);
      setDownloadError("");
    } catch {
      setDownloadError("Could not download the PDF. Please try printing the invoice instead.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Stack gap="md">
      {downloadError && <Alert color="red" className="no-print">{downloadError}</Alert>}
      <Group justify="flex-end" className="no-print">
        <Button variant="default" onClick={onDone}>{doneLabel}</Button>
        <Button
          color="dark"
          leftSection={<Download size={16} />}
          loading={downloading}
          onClick={downloadPdf}
        >
          Download PDF
        </Button>
        <Button variant="default" leftSection={<Printer size={16} />} onClick={() => window.print()}>
          Print
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