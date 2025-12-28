import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import useMenuInfo from "../../../context/store";
import { orderInfoAPI } from "../../../api/resturantinfo";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoChevronBackCircle } from "react-icons/io5";
import { axiosPublicInstance } from "../../../api";
import MenuLoader from "../../../components/Loader/MenuLoader";
import Menubar from "../../../components/Menu/Menubar";
import { useMediaQuery } from "@mantine/hooks";
import useGetAd from "../../../hooks/api/getAd";
import { useThemeStore } from "../../../providers/useThemeStore";

function OrderInfoDisplay() {
  const tableId = useMenuInfo((state) => state.tableId);
  const [isClient, setIsClient] = useState(false);
  const isTabletOrSmaller = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { data: adData } = useGetAd("history");
  const { brandColors } = useThemeStore();
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchOrderInfo = async () => {
    const response = await axiosPublicInstance.get(
      `${orderInfoAPI}/${tableId}`
    );
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orderData", tableId],
    queryFn: fetchOrderInfo,
    enabled: !!tableId,
    refetchOnWindowFocus: false,
  });

  if (isClient && !isTabletOrSmaller) {
    return (
      <Center mih="100vh">
        <Title size={40} ta="center" c="red">
          Sorry, this page is not available on larger screens.
        </Title>
      </Center>
    );
  }

  if (isLoading) return <MenuLoader />;

  if (isError || !data?.order) {
    return (
      <Center mih="100vh">
        <Text size="xl" c="dimmed">
          No order data found.
        </Text>
      </Center>
    );
  }

  const { order, totalAmount } = data;

  return (
    <Box>
      {/* Back Button + Title */}
      <Group align="center" mb={12}>
        <IoChevronBackCircle
          color={`${brandColors.primary}`}
          size={30}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <Title c={brandColors.primaryAccent} order={4}>
          Order History
        </Title>
      </Group>

      {/* Total Amount */}
      {adData?.url && (
        <a
          href={
            adData?.url?.startsWith("http://") ||
            adData?.url?.startsWith("https://")
              ? adData.url
              : `https://${adData?.url}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text size="sm" ta={"center"} c={"gray.6"}>
            Advertisement
          </Text>
          <Image src={adData?.image} />
        </a>
      )}
      <Stack align="center" gap={8} my={30}>
        <Text c={"gray"} fw={"bold"}>
          Total Amount
        </Text>
        <Text fw={"bold"} c={brandColors.primary} fz={28}>
          Rs {totalAmount ?? 0}
        </Text>
      </Stack>

      <Divider mt={10} mb={20} />

      {/* Order Items */}
      {order?.orderItem?.map((item) => {
        const itemTotalPrice =
          (item?.product?.price || 0) * (item?.quantity || 0);
        const addonTotalPrice = item?.orderAddOn?.reduce((acc, addon) => {
          return (
            acc + (addon?.productAddOn?.price || 0) * (addon?.quantity || 0)
          );
        }, 0);
        const grandTotal = itemTotalPrice + addonTotalPrice;

        return (
          <Paper
            key={item?.id}
            radius="md"
            shadow="lg"
            p="md"
            mt={10}
            pos={"relative"}
          >
            {/* Item Detail */}
            <Group align="start">
              <Image
                radius="md"
                miw={80}
                h={80}
                src={item?.product?.photo || ""}
                alt={item?.product?.name}
              />
              <Stack gap={6} w="100%">
                <Group justify="space-between" align="start">
                  <Box>
                    <Text fw={600}>{item?.product?.name}</Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      Ordered At:{" "}
                      {new Date(item?.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>
                  <Badge
                    variant="filled"
                    color={
                      item?.status === "accepted"
                        ? "green"
                        : item?.status === "pending"
                        ? "yellow"
                        : "red"
                    }
                    size="sm"
                  >
                    {item?.status}
                  </Badge>
                </Group>

                {/* Quantity and Base Price */}
                <Group justify="space-between">
                  <Text size="sm" c="gray">
                    Qty: {item?.quantity}
                  </Text>
                  <Text size="sm" c="gray">
                    Base Price: Rs {item?.product?.price}
                  </Text>
                  <Text size="sm" fw={700} c={brandColors.primary}>
                    Item Total: Rs {itemTotalPrice}
                  </Text>
                </Group>

                {/* Addons */}
                {item?.orderAddOn?.length > 0 && (
                  <>
                    <Divider my={8} />
                    <Stack gap={4}>
                      <Text size="sm" fw={600}>
                        Addons:
                      </Text>
                      {item?.orderAddOn?.map((addon) => (
                        <Group key={addon.id} justify="space-between">
                          <Text size="xs" c="gray">
                            {addon.productAddOn.name} × {addon.quantity}
                            <Text span>
                              {" "}
                              (Rs {addon.productAddOn.price} each)
                            </Text>
                          </Text>
                          <Text size="xs" fw={600}>
                            Rs {addon.productAddOn.price * addon.quantity}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </>
                )}

                {/* Grand Total */}
                <Divider my={8} />
                <Group justify="space-between">
                  <Text fw={700}>Grand Total:</Text>
                  <Text fw={700} c={brandColors.primary}>
                    Rs {grandTotal}
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Paper>
        );
      })}
    </Box>
  );
}

const Orders = () => {
  const navigate = useNavigate();
  const { brandColors } = useThemeStore();
  return (
    <Box p={20}>
      <OrderInfoDisplay />
      <Paper
        shadow="md"
        radius="lg"
        p="lg"
        mt={40}
        withBorder
        style={{ border: `2px solid ${brandColors.secondary}` }}
      >
        <Stack align="center" gap="xs">
          <Title order={5} c={brandColors.primaryAccent}>
            Want to order more?
          </Title>
          <Text ta="center" size="sm" c={brandColors.secondary}>
            You can continue browsing our delicious menu items and add more to
            your order!
          </Text>
          <Button
            color={brandColors.secondary}
            size="md"
            radius="xl"
            mt="sm"
            onClick={() => navigate("/menu")}
          >
            Browse Menu
          </Button>
        </Stack>
      </Paper>
      <Menubar />
    </Box>
  );
};

export default Orders;
