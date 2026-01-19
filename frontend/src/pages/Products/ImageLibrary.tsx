import {
  Box,
  Center,
  Flex,
  Grid,
  Image,
  Input,
  Loader,
  Paper,
  Text,
} from "@mantine/core";
import { CiSearch } from "react-icons/ci";
import { axiosPrivateInstance } from "../../api";
import { useQuery } from "@tanstack/react-query";
import AlertComponent from "../../components/utils/Error/AlertComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { useImageStore } from "../../providers/useImageStore";

interface Icon {
  createdAt: string;
  id: string;
  name: string;
  src: string;
  updatedAt: string;
}

const ImageLibray = () => {
  const { setSelectedImage } = useImageStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { formValues, additionalOptions } = location.state || {};
  const fetchIcon = async () => {
    const res = await axiosPrivateInstance.get("/library/image");
    return res.data;
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["image"],
    queryFn: fetchIcon,
  });

  const handleImageSelect = (src: string) => {
    setSelectedImage(src);
    navigate("/add-products", {
      state: {
        formValues,
        additionalOptions,
      },
    }); //navigate to prev page
  };

  if (isError) {
    return <AlertComponent title="Error Occurred" message={error.message} />;
  }

  return (
    <Box>
      <Input
        placeholder="Enter the name of the food"
        leftSection={<CiSearch />}
      />
      {isLoading ? (
        <Center style={{ height: "80vh" }}>
          <Loader size="xl" />
        </Center>
      ) : (
        <Grid p={20}>
          {data?.map((item: Icon) => (
            <Grid.Col span={2} key={item.id}>
              <Paper
                p={10}
                withBorder
                radius={14}
                shadow="lg"
                style={{ cursor: "pointer" }}
                onClick={() => handleImageSelect(item.src)}
              >
                <Flex
                  gap="xs"
                  direction="column"
                  justify="center"
                  align="center"
                >
                  <Image w={50} src={item.src} />
                  <Text ta="center">{item.name}</Text>{" "}
                  {/* Use the actual name */}
                </Flex>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ImageLibray;
