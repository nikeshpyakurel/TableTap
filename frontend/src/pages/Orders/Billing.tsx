import { Paper, Title, Group, Text, Divider, Box, Button } from "@mantine/core";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { IoMdDownload } from "react-icons/io";
import { axiosPrivateInstance } from "../../api";
import { settleBill } from "../../api/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuthStore from "../../providers/useAuthStore";

const Billing = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const orderId = location.state.order?.id;
  const componentRef = useRef<HTMLDivElement>(null);
  const { restaurantName, restaurantAddress, restaurantPhone } = useAuthStore(
    (state) => state
  );

  const handleDownloadPdf = () => {
    if (componentRef.current) {
      html2pdf().from(componentRef.current).save("invoice.pdf");
    }
  };
  const data = location.state;

  const tableId = data?.order?.session?.table?.id;

  const items = data?.order?.orderItem?.map((item: any) => {
    const addonTotal = item?.orderAddOn.reduce(
      (sum: number, addon: any) => sum + addon?.productAddOn?.price,
      0
    );
    const itemTotal = item?.quantity * (item?.product?.price + addonTotal);

    return {
      product: item?.product?.name,
      addons: item?.orderAddOn.map((addon: any) => ({
        name: addon?.productAddOn?.name,
        price: addon?.productAddOn?.price,
        quantity: addon?.quantity,
      })),
      price: item?.product?.price,
      quantity: item?.quantity,
      total: itemTotal,
    };
  }) || [<Text>No Products</Text>];

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = subtotal;

  // const rows = items?.map((element: any, index: any) => (
  //   <Table.Tr key={index}>
  //     <Table.Td>
  //       <Text fw={600}> {element?.product}</Text>
  //       {element?.addons?.length > 0 ? (
  //         <ul>
  //           {element.addons.map((addon: any, i: number) => (
  //             <li key={i}>
  //               {addon?.name} - Rs{addon?.price?.toFixed(2)}
  //             </li>
  //           ))}
  //         </ul>
  //       ) : (
  //         <Text>No Add-ons</Text>
  //       )}
  //     </Table.Td>
  //     <Table.Td>{element?.price}</Table.Td>
  //     <Table.Td>{element?.quantity}</Table.Td>
  //     <Table.Td>{element?.total}</Table.Td>
  //   </Table.Tr>
  // ));
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
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: () => {
      toast.error("Failed to accept order");
    },
  });
  return (
    <>
      <Group justify="end">
        <Button
          variant="default"
          loading={isPending}
          onClick={() => {
            mutate();
          }}
        >
          Settle Bill
        </Button>

        <IoMdDownload
          onClick={handleDownloadPdf}
          size={30}
          style={{ cursor: "pointer" }}
        />
      </Group>

      <Paper
        withBorder
        p="md"
        style={{ maxWidth: 340, margin: "auto" }}
        ref={componentRef}
      >
        <Box
          style={{ backgroundColor: "#333", color: "#fff", padding: "20px" }}
        >
          <Title order={2} style={{ color: "#fff" }} ta="center">
            INVOICE
          </Title>

          <Text size="sm" ta="center" mt="xs">
            <strong>{restaurantName}</strong>
          </Text>
          <Text size="xs" ta="center">
            {restaurantAddress}
          </Text>
          <Text size="xs" ta="center">
            {restaurantPhone}
          </Text>
        </Box>

        <Box p="md">
          <Text size="xs" ta="center" mb="xs">
            Invoice Date: {formattedDate}
          </Text>

          <Divider my="xs" />

          {items.map((item: any, idx: number) => (
            <Box key={idx} mb="sm">
              <Group justify="space-between">
                <Text size="sm" fw={600}>
                  {item.product}
                </Text>
                <Text size="sm">Rs {item.price?.toFixed(2)}</Text>
              </Group>

              {item.addons.length > 0 && (
                <Box ml="md" mt={4}>
                  {item.addons.map((addon: any, i: number) => (
                    <Group key={i} justify="space-between">
                      <Text size="xs" c="dimmed">
                        + {addon.name} (Rs {addon.price}) x {addon.quantity}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Rs {(addon.price * addon.quantity).toFixed(2)}
                      </Text>
                    </Group>
                  ))}
                </Box>
              )}

              <Group justify="space-between" mt={4}>
                <Text size="xs" c="dimmed">
                  Quantity: {item.quantity}
                </Text>
                <Text size="xs" fw={600}>
                  Total: Rs {item.total?.toFixed(2)}
                </Text>
              </Group>

              <Divider my="xs" />
            </Box>
          ))}

          <Group justify="space-between" mt="md">
            <Text fw={700}>Grand Total</Text>
            <Text fw={700}>Rs {grandTotal?.toFixed(2)}</Text>
          </Group>

          <Divider my="sm" />

          <Text ta="center" size="xs" mt="md" c="dimmed">
            Thank you for your visit!
          </Text>
          <Text ta="center" fz={9} mt="md" c="dimmed">
            Developed By Nikesh Pyakurel
          </Text>
          <Text ta="center" fz={9} mt={2} c="dimmed">
            www.nikeshpyakurel.com.np
          </Text>
        </Box>
      </Paper>
    </>
  );
};

export default Billing;
