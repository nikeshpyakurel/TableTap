import {
  Box,
  Center,
  Flex,
  Group,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { MdOutlineMessage } from "react-icons/md";
import { BsInfoCircleFill } from "react-icons/bs";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import Menubar from "../../../components/Menu/Menubar";
import { useNavigate, useParams } from "react-router-dom";
// import api from "../../api";
import { axiosPublicInstance } from "../../../api";
import { getIndividualOrderAPI } from "../../../api/resturantinfo";
import { useQuery } from "@tanstack/react-query";
import { IoChevronBackCircle } from "react-icons/io5";
import MenuLoader from "../../../components/Loader/MenuLoader";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const { orderId } = useParams();

  const isTabletOrSmaller = useMediaQuery("(max-width: 768px)");

  const orderInfo = async () => {
    const resp = await axiosPublicInstance.get(
      `${getIndividualOrderAPI}/${orderId}`
    );

    return resp.data;
  };

  const { data: OrderItems, isLoading } = useQuery({
    queryKey: [`individualOrderDetail/${orderId}`],
    queryFn: orderInfo,
  });

  if (isLoading) {
    return <MenuLoader />;
  }

  const sum = OrderItems?.orderItem?.reduce((total: any, item: any) => {
    return total + item?.product.price * item.quantity;
  }, 0);

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
    <Box p={20}>
      <IoChevronBackCircle
        color="#ed5003"
        size={30}
        onClick={() => navigate(-1)}
      />
      <Center>
        <Title size={25} c="#ED5003">
          My Cart
        </Title>
      </Center>

      <Paper shadow="xl" p={20}>
        <Flex justify="space-between">
          <Text fw="bold">Order Summary</Text>
          {OrderItems.staus == "approved" && (
            <Button
              onClick={open}
              variant="transparent"
              c="#FF6347"
              style={{
                border: "1px solid gray",
                borderRadius: "8px",
                paddingInline: "4px",
              }}
            >
              Cancel Order
            </Button>
          )}
        </Flex>

        <Paper p={20} radius="md" mt={20} withBorder>
          <Group>
            <MdOutlineMessage color="#ff6347" size={30} />
            <Text>Message</Text>
          </Group>

          {OrderItems.staus == "approved" ? (
            <Text c="green">Your order is received and being prepared.</Text>
          ) : (
            <Text c="red">Your order got cancelled..</Text>
          )}
        </Paper>

        <Box p={8} my={20}>
          <Text size="xs">
            <span style={{ fontWeight: "bold" }}>Order ID:</span> {orderId}
          </Text>

          {OrderItems?.orderItem?.map((orderItem: any) => (
            <Group key={orderItem.id} gap="md" my={20}>
              <Image w={80} src={orderItem?.product?.photo} />

              <Flex direction="column">
                <Text>{orderItem?.product?.name}</Text>
                <Text fw="bold" c="#FF6347">
                  Rs {orderItem?.product?.price}
                </Text>
              </Flex>
              <Flex direction="column">
                <Text>Quantity</Text>
                <Text fw="bold" c="#FF6347">
                  {orderItem?.quantity}
                </Text>
              </Flex>
            </Group>
          ))}

          <Modal opened={opened} onClose={close}>
            <Box>
              <Text fw="bold" c="#ff6347" ta="center">
                Cancel Order
              </Text>

              <Text my={20} ta="center" fw="bold">
                Are you sure you want to cancel the order?
              </Text>

              <Group my={20} justify="center">
                <Button onClick={close} c="dimmed" variant="transparent">
                  Cancel
                </Button>
                <Button size="md" bg="#ff6347">
                  Yes
                </Button>
              </Group>
            </Box>
          </Modal>

          <Text ta="center" size="xl">
            Total Payment
          </Text>
          <Text ta="center" fw="bold" size="xl" c="#ff6347">
            Rs {sum}
          </Text>

          <Flex mt={40} justify="space-between" gap="md">
            <BsInfoCircleFill color="#ff6347" size={35} />
            <Text size="xs" c="dimmed">
              Note: You may settle the bill using cash or QR code, either
              through our attentive waiter or directly at the counter.
            </Text>
          </Flex>
        </Box>
      </Paper>
      <Menubar />
    </Box>
  );
};

export default OrderDetails;
