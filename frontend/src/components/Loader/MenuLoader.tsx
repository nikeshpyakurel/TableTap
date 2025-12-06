import { Flex, Space } from "@mantine/core";
import LottieLoader from "./Loader.json";
import Lottie from "react-lottie";
import { BarLoader } from "react-spinners";

const MenuLoader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LottieLoader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Flex h="100vh" direction={"column"} align={"center"} justify={"center"}>
      <Lottie options={defaultOptions} height={120} width={120} />
      <Space h={"md"} />
      <BarLoader color="orange" />
    </Flex>
  );
};

export default MenuLoader;
