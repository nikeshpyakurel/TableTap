/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../providers/useAuthStore";
import { useEffect } from "react";
import { TbScreenShareOff, TbScreenShare } from "react-icons/tb";
import { useFullscreen } from "@mantine/hooks";
import useSocketStore from "../providers/useSocketStore";
import { GoPerson } from "react-icons/go";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const Topbar = ({ data }) => {
  const navigate = useNavigate();
  const setRestaurantId = useAuthStore((state) => state.setRestaurantId);

  const { setRestaurantName, setRestaurantAddress, setRestaurantPhone } =
    useAuthStore((state) => state);
  const { clearSocketRef } = useSocketStore();
  const { toggle, fullscreen } = useFullscreen();
  useEffect(() => {
    if (data) {
      const restaurantId = data.restaurant?.id;
      if (restaurantId) {
        setRestaurantId(restaurantId);
      }
      const restaurantName = data.restaurant?.name;
      if (restaurantName) {
        setRestaurantName(restaurantName);
        setRestaurantAddress(data.restaurant?.address);
        setRestaurantPhone(data.restaurant?.phone);
      }
    }
  }, [data]);

  const logout = () => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.location.href = "/";
    clearSocketRef();
  };

  return (
    <Flex
      w="100%"
      justify={{ base: "flex-end", sm: "space-between" }}
      align={"center"}
    >
      <Image w={100} visibleFrom="sm" src="/scanmenu.png" alt="Tabletap Logo" />

      <Group>
        <Button
          variant="transparent"
          onClick={toggle}
          color={fullscreen ? "red" : "blue"}
          visibleFrom="sm"
        >
          {fullscreen ? (
            <TbScreenShareOff size={25} />
          ) : (
            <TbScreenShare size={25} />
          )}
        </Button>

        <Group p={10} justify="flex-end">
          <Image
            h={40}
            w={40}
            radius={40}
            src={data?.userInfo?.restaurant?.photo}
          />
          <Box>
            <Text fw="bold" c="#6B7280" size="sm">
              {data?.userInfo?.restaurant?.name}
            </Text>
            <Text>Admin</Text>
          </Box>
          <Menu shadow="md" width={280}>
            <Menu.Target>
              <UnstyledButton c={"orange"}>
                <IoIosArrowDropdownCircle size={22} />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                key="my-profile"
                onClick={() => navigate("/myprofile", { state: data })}
                leftSection={<GoPerson size={20} />}
              >
                My Profile
              </Menu.Item>

              <Menu.Item
                key="logout"
                onClick={logout}
                leftSection={<RiLogoutCircleRLine size={20} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Flex>
  );
};

export default Topbar;
