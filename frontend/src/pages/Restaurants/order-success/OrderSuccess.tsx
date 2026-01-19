import { Button, Center, Flex, Text, Title } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import Lottie from "react-lottie";
import orderSuccess from "../../../assets/success.json";
import { useThemeStore } from "../../../providers/useThemeStore";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { brandColors } = useThemeStore();
  const isTabletOrSmaller = useMediaQuery("(max-width: 768px)");
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: orderSuccess,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (!isTabletOrSmaller) {
    return (
      <Center mih="100vh">
        <Title size={40} ta="center" c="red">
          Sorry, This page cannot be displayed on larger screens
        </Title>
      </Center>
    );
  }
  return (
    <Flex gap="md" direction="column" h={"100svh"} justify={"center"} px={40}>
      <Title order={2} fw="bold" ta="center" c={"#3a3a3a"}>
        Order Placed Successfully!!
      </Title>

      <Text size="sm" ta="center" c="dimmed">
        Your order has been placed successfully! You can track its status in
        your orders menu below.
      </Text>
      <Lottie options={defaultOptions} height={120} width={120} />

      <Button
        onClick={() => navigate("/orders-page")}
        radius={"md"}
        size="lg"
        bg={brandColors.primary}
        mt={"xl"}
      >
        View Order Status
      </Button>
    </Flex>
  );
};

export default OrderSuccess;
