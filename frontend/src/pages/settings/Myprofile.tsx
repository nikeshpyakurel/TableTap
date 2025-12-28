import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { userInfo } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const Myprofile = () => {
  const navigate = useNavigate();
  const { isLoading, data } = useQuery({
    queryKey: ["userinfo"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(userInfo);
      return response.data;
    },
  });
  if (isLoading) {
    <Box h={50}>
      <Loader color="blue" />
    </Box>;
  }

  return (
    <Box>
      <Paper p={40} withBorder>
        <Title size="h3" c="#ff6347">
          My Profile
        </Title>

        <Paper p={80} withBorder mt={10}>
          <Flex align="center" gap={20}>
            <Avatar
              size="sm"
              src={data?.userInfo?.restaurant?.photo || data?.userInfo?.photo}
            />

            <Flex direction="column">
              <Text>{data?.userInfo?.restaurant?.name}</Text>
              {/* <Text>{data?.email}</Text> */}
            </Flex>
          </Flex>

          <Divider mt={30} />

          <Flex direction="column" gap="lg" mt="lg">
            <Flex justify="space-between">
              <Text>Name</Text>
              <Text>
                {data?.userInfo?.restaurant?.name || data?.userInfo?.name}
              </Text>
            </Flex>

            <Divider />

            <Divider />

            <Flex justify="space-between">
              <Text>Phone Number</Text>
              <Text>
                {data?.userInfo?.restaurant?.phone || data?.userInfo?.phone}
              </Text>
            </Flex>

            <Divider />

            <Flex justify="space-between">
              <Text>Address</Text>
              <Text>
                {data?.userInfo?.restaurant?.address || data?.userInfo?.address}
              </Text>
            </Flex>
          </Flex>

          <Button
            onClick={() => navigate("/settings", { state: data })}
            mt={20}
          >
            Edit Profile
          </Button>
        </Paper>
      </Paper>
    </Box>
  );
};

export default Myprofile;
