import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Image,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import Menu from "../../../components/Menu/Menubar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { checkSessionAPI } from "../../../api/resturantinfo";
import { useQuery } from "@tanstack/react-query";
import MenuLoader from "../../../components/Loader/MenuLoader";
import useMenuInfo from "../../../context/store";
import { useEffect, useState } from "react";
import CheckSessionPage from "../CheckSession";
import { axiosPublicInstance } from "../../../api";
import AlertComponent from "../../../components/utils/Error/AlertComponent";
import { IoIosAddCircle } from "react-icons/io";
import { Product } from "../../Products/Products";
import AdModal from "./AdModal";
import { useThemeStore } from "../../../providers/useThemeStore";
import { useRestaurantStore } from "../../../providers/useResturantStore";

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const { setRestaurantIdAndTableId, restaurantId, tableId } = useMenuInfo();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const isTabletOrSmaller = useMediaQuery("(max-width: 768px)");
  const [showAd, setShowAd] = useState(true);
  const { brandColors } = useThemeStore();
  const { restaurant } = useRestaurantStore();
  useEffect(() => {
    setIsClient(true);
    const hasSeenAd = sessionStorage.getItem("hasSeenAd");
    if (hasSeenAd === "true") {
      setShowAd(false);
    } else {
      setShowAd(true);
    }
  }, []);

  const handleAdClose = () => {
    setShowAd(false);
    sessionStorage.setItem("hasSeenAd", "true");
  };

  useEffect(() => {
    const restaurant = searchParams.get("restaurant");
    const table = searchParams.get("table");

    if (restaurant && table) {
      setRestaurantIdAndTableId(restaurant, table);
    }
  }, [searchParams, setRestaurantIdAndTableId]);

  const phoneNumber = useMenuInfo((state) => state.contactNumber);
  const isAdult = sessionStorage.getItem("isAdult") === "true";

  const CheckSession = async () => {
    const resp = await axiosPublicInstance.get(`${checkSessionAPI}/${tableId}`);
    return resp.data;
  };

  const getAllProduct = async () => {
    const res = await axiosPublicInstance.get(
      `product/product/${restaurantId}`
    );
    return res.data;
  };

  const getTodaysSpecial = async () => {
    const res = await axiosPublicInstance.get(
      `product/special-product/${restaurantId}`
    );
    return res.data;
  };

  const getMostPopular = async () => {
    const res = await axiosPublicInstance.get(
      `/product/popular-product/${restaurantId}`
    );
    return res.data;
  };

  const { data: sessionState, isLoading: isLoadingSession } = useQuery<any>({
    queryKey: ["sessionStatus"],
    queryFn: CheckSession,
    enabled: !!tableId,
  });

  const todaysSpecial = useQuery({
    queryKey: ["todaysSpecial"],
    queryFn: getTodaysSpecial,
    enabled: !!restaurantId,
  });

  const mostPopular = useQuery({
    queryKey: ["mostPopular"],
    queryFn: getMostPopular,
    enabled: !!restaurantId,
  });

  const allProduct = useQuery({
    queryKey: ["allProduct"],
    queryFn: getAllProduct,
    enabled: !!restaurantId,
  });

  function Slider({ data }: { data: Product[] }) {
    if (!data || data.length === 0) return <Text>No items found.</Text>;
    return (
      <Carousel
        slideSize="40%"
        slideGap="md"
        withControls={false}
        loop
        align="start"
        controlSize={22}
      >
        {data.map((item: Product) => {
          if (item.status !== "available") return null;
          if (
            item.isAgeRestricted &&
            sessionStorage.getItem("isAdult") !== "true"
          )
            return null;

          return (
            <Carousel.Slide key={item?.id}>
              <Card
                withBorder
                shadow="sm"
                radius="md"
                padding="md"
                w={220}
                h={250}
                onClick={() => navigate(`/item-details/${item?.id}`)}
              >
                <Card.Section>
                  <Image
                    src={item?.photo}
                    h={120}
                    alt={item?.name}
                    radius="sm"
                  />
                </Card.Section>
                <Stack gap={4} mt={8}>
                  <Text fw={500} c={brandColors.primaryAccent} lineClamp={1}>
                    {item?.name}
                  </Text>
                  <Text c={brandColors.primaryAccent} fw={"bold"}>
                    Rs {item?.price}
                  </Text>
                </Stack>
                <Button
                  variant="light"
                  color={brandColors.secondary}
                  fullWidth
                  radius="md"
                  mt="auto"
                  rightSection={<IoIosAddCircle size={18} />}
                >
                  Add to cart
                </Button>
              </Card>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    );
  }

  const MenuContent = () => (
    <>
      <Box>
        <Image src={restaurant?.coverImage} h={200} />
        <Flex direction="column" align="center" mt={12}>
          <Title
            ta="center"
            my={12}
            size={30}
            c={brandColors.primary}
            fw="bold"
          >
            {restaurant?.name}
          </Title>

          <Select
            searchable
            nothingFoundMessage="No product found"
            w={"90%"}
            placeholder="Search & go to product..."
            data={
              allProduct?.data
                ?.filter((product: Product) => {
                  if (product.isAgeRestricted && !isAdult) return false;
                  return true;
                })
                .map((product: any) => ({
                  label: product.name,
                  value: product.id,
                })) ?? []
            }
            onChange={(value) => {
              if (value) navigate(`/item-details/${value}`);
            }}
            styles={{
              input: {
                padding: "25px",
                borderRadius: "16px",
                borderColor: `${brandColors.primaryAccent}`,
                borderWidth: "2px",
              },
              option: {
                marginTop: "10px",
              },
            }}
          />
        </Flex>

        <Box py={20} px={20}>
          <Text fz={18} mb={12} fw="bold" c={brandColors.primary}>
            Today's Special
          </Text>
          <Slider data={todaysSpecial?.data?.pagedProducts ?? []} />

          <Text mt={20} mb={8} size="lg" fw="bold" c={brandColors.primary}>
            Most Popular
          </Text>
          <Slider data={mostPopular.data ?? []} />

          <Menu />
        </Box>
      </Box>
    </>
  );

  if (!isClient) return null;

  return (
    <>
      <AdModal opened={showAd} onClose={handleAdClose} />

      {!restaurantId || !tableId ? (
        <AlertComponent
          title="QR malformed"
          message="Please scan a valid QR Code"
        />
      ) : !isTabletOrSmaller ? (
        <Center mih="100vh">
          <Title size={40} ta="center" c="red">
            Sorry, This page cannot be displayed on larger screens
          </Title>
        </Center>
      ) : isLoadingSession ? (
        <MenuLoader />
      ) : sessionState?.session === false ||
        (sessionState?.session === true &&
          sessionState?.phone?.toString() === phoneNumber?.toString()) ? (
        <MenuContent />
      ) : (
        <CheckSessionPage sessionPhoneNumber={sessionState?.phone} />
      )}
    </>
  );
};

export default MenuPage;
