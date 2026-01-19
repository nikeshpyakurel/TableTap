/* eslint-disable react-hooks/exhaustive-deps */
import {
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/Navbar/DashboardNavbar";
import Topbar from "./Topbar";
import useSocketStore from "../providers/useSocketStore";
import { useEffect, useRef } from "react";
import useAuthStore from "../providers/useAuthStore";
import { io, Socket } from "socket.io-client";
import { axiosPrivateInstance, socketbaseURL } from "../api";
import { useQuery } from "@tanstack/react-query";
import { userInfo } from "../api/auth";
import useStaffAuthStore from "../providers/useStaffAuthStore";

export default function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure();
  const notificationSound = useRef<HTMLAudioElement>(
    new Audio("/audio/audio.mpeg")
  );
  const { isModelOpen, setIsModelOpen, restaurantId, setRestaurantId } =
    useAuthStore();
  const { setPermission, setIsAuth, setRole } = useStaffAuthStore();
  const { socketRef, setSocketRef } = useSocketStore();

  const token =
    window.sessionStorage.getItem("rToken") ||
    window.localStorage.getItem("rToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
  }, [token]);

  // Fetch user info
  const {
    isLoading,
    data,
    error: errorToGet,
  } = useQuery({
    queryKey: ["userinfo"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(userInfo);

      if (response.data.role === "staff") {
        setRestaurantId(response.data?.rId);
      } else {
        setRestaurantId(response.data?.userInfo?.restaurant?.id);
      }

      if (response.data.permissionarray) {
        setPermission(response.data.permissionarray);
      }
      setRole(response.data.role);
      setIsAuth(true);

      return response.data;
    },
  });

  // Redirect to login on unauthorized error
  useEffect(() => {
    if ((errorToGet as any)?.response?.status === 401) {
      window.localStorage.removeItem("rToken");
      window.sessionStorage.removeItem("rToken");
      window.location.href = "/";
    }
  }, [errorToGet]);

  // Initialize socket connection
  useEffect(() => {
    if (!socketRef && restaurantId) {
      // const newSocket: Socket = io(`${socketbaseURL}/orders`, {
      //   query: { room: restaurantId },
      // });
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

      newSocket.on("connect", () => {
        console.log("Socket Connected");
      });

      newSocket.on("disconnect", () => {
        console.log("Socket Disconnected");
      });

      // Set socket reference in the store
      setSocketRef(newSocket);

      // Cleanup on component unmount
      // return () => {
      //   newSocket.disconnect();
      // };
    }
  }, [restaurantId, socketRef]);

  // Enable audio for notifications
  const handleEnableAudio = () => {
    notificationSound.current.play().catch((error) => {
      console.error("Audio playback was prevented:", error);
    });
    setIsModelOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <Center h="50vh">
        <Box ta="center">
          <Flex direction={"column"} align="center" justify="center">
            <Loader color="blue" />
            <Text mt={10} fw={400} ta="center">
              Your dashboard is being prepared. Please wait...
            </Text>
          </Flex>
        </Box>
      </Center>
    );
  }

  // Error state
  if (errorToGet) {
    return <div>Error: {errorToGet.message}</div>;
  }

  // Dashboard Layout
  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: { sm: 250, lg: 250 },
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Flex align={"center"} h={"100%"} ml={10}>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
            />
            <Topbar data={data} />
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar bg={"#363740"}>
          <DashboardNavbar toggle={toggle} />
        </AppShell.Navbar>

        <AppShell.Main
          pt={{ lg: 95, sm: 80 }}
          pr={{ lg: 30, sm: 18 }}
          pb={{ lg: 30, sm: 15 }}
          pl={{ lg: 280, sm: 280 }}
          bg="#f0f0fa"
        >
          <Outlet />
        </AppShell.Main>
      </AppShell>
      <Modal
        opened={isModelOpen}
        onClose={() => setIsModelOpen(false)}
        title="Enable Notification Sound"
      >
        <Text>
          This page requires audio permission for notifications. Please allow
          audio to enhance your experience.
        </Text>
        <Group mt="md">
          <Button onClick={handleEnableAudio}>Allow Audio</Button>
          <Button variant="outline" onClick={() => setIsModelOpen(false)}>
            Block
          </Button>
        </Group>
      </Modal>
    </>
  );
}
