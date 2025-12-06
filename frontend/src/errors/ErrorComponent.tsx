import { Box, Center, Text, Title } from "@mantine/core";
import Lottie from "react-lottie";
import { Link, useRouteError } from "react-router-dom";
import notFound from "../404.json";
import err from "../error.json";

interface RouteError {
  status?: number;
  data?: string;
  message?: string;
}

const ErrorComponent = () => {
  const error = useRouteError() as RouteError;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: notFound,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const errOption = {
    loop: true,
    autoplay: true,
    animationData: err,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  if (error?.status === 404) {
    return (
      <Center style={{ flexDirection: "column", height: "100vh" }}>
        <Box maw={700}>
          <Lottie options={defaultOptions} />
        </Box>
        <Title order={3}>Ohh!!</Title>
        <Text size="lg">Something went wrong.</Text>
        <span style={{ color: "red", textAlign: "center" }}>{error.data}</span>
        <Link to="/">Navigate Home</Link>
      </Center>
    );
  }

  return (
    <Center style={{ flexDirection: "column", height: "100vh" }}>
      <Box maw={700}>
        <Lottie options={errOption} />
      </Box>
      <Title order={3}>Oops!</Title>
      <Text ta={"center"} size="lg">
        Something went wrong.
      </Text>
      <span style={{ color: "red", textAlign: "center" }}>
        {error.toString()}
      </span>
      <Link to="/">Navigate Home</Link>
    </Center>
  );
};

export default ErrorComponent;
