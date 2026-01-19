import { Box, Center, Loader } from "@mantine/core";

const LoadComponent = () => {
  return (
    <>
      <Center h="50vh">
        <Box ta="center">
          <Loader color="blue" />
        </Box>
      </Center>
    </>
  );
};

export default LoadComponent;
