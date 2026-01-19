import { Button, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import Sales from "./Sales";
import Orders from "./Orders";
import useAuthStore from "../../providers/useAuthStore";
import TrendingOrderCarousel from "./TrendingOrderCarousel";
import ResturantInfo from "./ResturantInfo";
import { useMediaQuery } from "@mantine/hooks";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { restaurantId } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();

  //Sales Query
  async function getSales() {
    const res = await axiosPrivateInstance.get("/dashboard/sales");
    return res.data;
  }
  const { data: salesData } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  //Get Order Query
  async function getOrder() {
    const res = await axiosPrivateInstance.get("/dashboard/order");
    return res.data;
  }
  const { data: orderData } = useQuery({
    queryKey: ["order"],
    queryFn: getOrder,
  });

  //Get Trending Order
  async function getTrendingOrder() {
    const res = await axiosPrivateInstance.get(
      `/dashboard/popular-item/${restaurantId}`
    );
    return res.data;
  }
  const { data: trendingOrder } = useQuery({
    queryKey: ["trending-order"],
    queryFn: getTrendingOrder,
  });

  //Get Trending Order
  async function getResturantInfo() {
    const res = await axiosPrivateInstance.get(`/dashboard/restro-info`);
    return res.data;
  }
  const { data: resInfo } = useQuery({
    queryKey: ["resturant-info"],
    queryFn: getResturantInfo,
  });

  return (
    <Paper mih={"80vh"} p={20}>
      <ResturantInfo data={resInfo} />

      {isMobile && (
        <>
          <Text fz={18} fw={"bold"} c={"#3b3b3b"}>
            Quick Navigation
          </Text>
          <Stack gap={8} mt={8}>
            <Button size="md" bg={"orange"} onClick={() => navigate("/orders")}>
              Order
            </Button>
            <Button
              size="md"
              bg={"orange"}
              onClick={() => navigate("/quick-food-order")}
            >
              Quick Order
            </Button>
            <Button
              size="md"
              bg={"orange"}
              onClick={() => navigate("/table-order")}
            >
              Table Order
            </Button>
          </Stack>
        </>
      )}
      <ProtectComponent requiredPermission={PermissionType.VIEW_STATISTICS}>
        <Text fz={18} fw={"bold"} c={"#3b3b3b"} mt={16}>
          Statistics
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt={20}>
          <Sales data={salesData} />
          <Orders data={orderData} />
        </SimpleGrid>
      </ProtectComponent>

      <Text fz={18} mt={20} fw={"bold"} c={"#2b2727"}>
        Trending Order
      </Text>
      <TrendingOrderCarousel data={trendingOrder} />
    </Paper>
  );
}
