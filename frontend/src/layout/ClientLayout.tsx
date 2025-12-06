import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import useSocketStore from "../context/SocketStore";
import useMenuInfo from "../context/store";
import { io, Socket } from "socket.io-client";
import { axiosPublicInstance, socketbaseURL } from "../api";
import { checkSessionAPI, resturantInfo } from "../api/resturantinfo";
import CheckSessionPage from "../pages/Restaurants/CheckSession";
import MenuLoader from "../components/Loader/MenuLoader";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Box, Center, Stack, Title, Modal, Button, Text } from "@mantine/core";
import { LuScanFace } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { useRestaurantStore } from "../providers/useResturantStore";
import { useThemeStore } from "../providers/useThemeStore";

interface sessionResp {
  session: boolean;
  phone: number;
}

const ClientLayout = () => {
  const { socketRef, setSocketRef } = useSocketStore();
  const [searchParams] = useSearchParams();
  const { setRestaurantIdAndTableId, restaurantId, tableId, contactNumber } =
    useMenuInfo();
  const { setRestaurant, restaurant } = useRestaurantStore();
  const { setBrandColorsFromHex } = useThemeStore();
  const [session, setSession] = useState<sessionResp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isTabletOrSmaller = useMediaQuery("(max-width: 768px)");
  const [isClient, setIsClient] = useState(false);

  const [adultConfirmed, setAdultConfirmed] = useState<boolean | null>(null);
  const [adultModalOpened, { open: openAdultModal, close: closeAdultModal }] =
    useDisclosure(false);

  //Setting up the resturant info and color theme
  const getResturant = async () => {
    const resp = await axiosPublicInstance.get(
      `${resturantInfo}/${restaurantId}`
    );
    return resp.data;
  };

  const { data } = useQuery({
    queryKey: ["getResturantInfo"],
    queryFn: getResturant,
    enabled: !!restaurantId,
  });

  useEffect(() => {
    if (data) {
      setRestaurant(data);
    }
    if (restaurant?.theme) {
      setBrandColorsFromHex(data?.theme);
    }
  }, [data, setRestaurant, setBrandColorsFromHex, restaurant]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const isAdult = sessionStorage.getItem("isAdult");
    if (isAdult === "true") {
      setAdultConfirmed(true);
    } else if (isAdult === "false") {
      setAdultConfirmed(false);
    } else {
      openAdultModal();
    }
  }, [openAdultModal]);

  const handleAdultResponse = (isAdult: boolean) => {
    sessionStorage.setItem("isAdult", isAdult.toString());
    setAdultConfirmed(isAdult);
    closeAdultModal();
  };

  useEffect(() => {
    const sessionFetch = async () => {
      try {
        setIsLoading(true);
        const resp = await axiosPublicInstance.get(
          `${checkSessionAPI}/${tableId}`
        );
        setSession(resp.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (tableId) {
      sessionFetch();
    }
  }, [tableId]);

  useEffect(() => {
    const fetchSessionAndSetParams = async () => {
      const restaurant = searchParams.get("restaurant");
      const table = searchParams.get("table");

      if (restaurant && table) {
        setRestaurantIdAndTableId(restaurant, table);

        try {
          setIsLoading(true);
          const resp = await axiosPublicInstance.get(
            `${checkSessionAPI}/${table}`
          );
          setSession(resp.data);
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || err.message || "An error occurred";
          throw new Error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSessionAndSetParams();
  }, [searchParams, setRestaurantIdAndTableId]);

  useEffect(() => {
    if (!socketRef && restaurantId) {
      const newSocket: Socket = io(`${socketbaseURL}`, {
        query: { room: restaurantId },
        path: "/socket.io",
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      newSocket.on("connect_timeout", (timeout) => {
        console.error("Connection timeout:", timeout);
      });

      newSocket.on("connect", () => {});

      newSocket.on("disconnect", () => {});

      setSocketRef(newSocket);
    }
  }, [socketRef, restaurantId, setSocketRef]);

  if (!isClient) {
    return null;
  }

  if (adultConfirmed === null) {
    return (
      <>
        <Modal
          opened={adultModalOpened}
          onClose={() => {}}
          centered
          withCloseButton={false}
          size="md"
          overlayProps={{
            backgroundOpacity: 0.75,
            blur: 5,
          }}
        >
          <Stack gap="xl" align="center">
            <Text size="lg" fw={500}>
              Are you above 18 years old?
            </Text>
            <Stack w="100%">
              <Button color="green" onClick={() => handleAdultResponse(true)}>
                Yes, I am
              </Button>
              <Button
                color="red"
                variant="outline"
                onClick={() => handleAdultResponse(false)}
              >
                No, I am not
              </Button>
            </Stack>
          </Stack>
        </Modal>
      </>
    );
  }

  if (!isTabletOrSmaller) {
    return (
      <Center mih="100vh">
        <Title size={40} ta="center" c="red">
          Sorry, This page cannot be displayed on larger screens
        </Title>
      </Center>
    );
  }

  if (!restaurantId || !tableId) {
    return (
      <Stack align="center" mt="xl">
        <Box>
          <LuScanFace size={100} color="orange" />
        </Box>
        <Box>
          <Title order={2} ta="center" c="orange">
            Please scan the <br /> QR code
          </Title>
        </Box>
      </Stack>
    );
  }

  if (isLoading) {
    return <MenuLoader />;
  }

  return (
    <>
      {session?.session === false ||
      (session?.session === true &&
        session?.phone?.toString() === contactNumber?.toString()) ? (
        <Outlet />
      ) : (
        <CheckSessionPage sessionPhoneNumber={session?.phone} />
      )}
    </>
  );
};

export default ClientLayout;
