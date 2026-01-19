import {
  Paper,
  Title,
  Group,
  Text,
  Table,
  Divider,
  Box,
  Button,
} from "@mantine/core";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { axiosPrivateInstance } from "../../api";
import { settleBill } from "../../api/order";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoMdDownload } from "react-icons/io";
import useAuthStore from "../../providers/useAuthStore";

const ReceptionBilling = () => {
  const { restaurantName, restaurantAddress, restaurantPhone } = useAuthStore(
    (state) => state
  );
  const componentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const data = location.state;
  const orderId = data?.id;
  const tableId = data?.session?.table?.id;

  const handleDownloadPdf = () => {
    if (componentRef.current) {
      html2pdf()
        .from(componentRef.current) // Target the div to convert to PDF
        .save("invoice.pdf"); // Save it as a PDF
    }
  };

  const items = data?.orderItem?.map((item: any) => ({
    product: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    total: item.quantity * item.product.price,
  })) || [
    <Text>No Products</Text>,
    // other fallback items
  ];

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = subtotal;

  const rows = items?.map((element: any, index: any) => (
    <Table.Tr key={index}>
      <Table.Td>{element.product}</Table.Td>
      <Table.Td>{element.price}</Table.Td>
      <Table.Td>{element.quantity}</Table.Td>
      <Table.Td>{element.total}</Table.Td>
    </Table.Tr>
  ));
  // Get today's date in DD-MM-YYYY format
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${today.getFullYear()}`;

  const SettleBilling = async () => {
    const response = await axiosPrivateInstance.post(
      `${settleBill}/${orderId}?tableId=${tableId}`
    );
    return response;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: SettleBilling,
    onSuccess: () => {
      toast.success("Billing settle successfully");
    },
    onError: () => {
      toast.error("Failed to accept order");
    },
  });

  return (
    <>
      <Group justify="end">
        <Button variant="default" loading={isPending} onClick={() => mutate()}>
          Settle Bill
        </Button>
        <IoMdDownload size={30} onClick={handleDownloadPdf} />
      </Group>

      <Paper
        shadow="md"
        p="md"
        style={{ maxWidth: 300, margin: "auto" }}
        ref={componentRef}
      >
        <Box
          style={{ backgroundColor: "#333", color: "#fff", padding: "20px" }}
        >
          <Title order={2} style={{ color: "#fff" }}>
            INVOICE
          </Title>

          <Text size="sm" ta="left">
            <strong>{restaurantName}</strong>
          </Text>

          <Text size="sm" ta="left">
            {restaurantAddress}
          </Text>
          <Text size="sm" ta="left">
            {restaurantPhone}
          </Text>
        </Box>

        <Box p="md">
          <Text>
            <strong>Invoice Date:</strong>
            {formattedDate}
          </Text>

          <Divider my="md" />

          {/* Product table */}
          <Table ml={-10}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>

          <Divider my="sm" />

          {/* Totals */}
          <Group justify="end">
            <Box>
              {/* <Text>
                <strong>Discount:</strong> Rs 100
              </Text> */}
              <Text>
                <strong>Total:</strong> Rs {grandTotal}
              </Text>
            </Box>
          </Group>

          <Divider my="sm" />
        </Box>
      </Paper>
    </>
  );
};

export default ReceptionBilling;
