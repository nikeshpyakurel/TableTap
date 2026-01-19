import { Box, Button, Group, Image, Paper, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { orderByTableId } from "../../api/order";

enum orderStatus {
  pending = "pending",
  accepted = "accepted",
  completed = "completed",
  partiallyDelivered = "partiallyDelivered",
  canceled = "canceled",
}

const OrderDetails = () => {
  const [showNewOrders, setShowNewOrders] = useState(false);
  const [showActiveOrders, setShowActiveOrders] = useState(false);
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: [`TableOrder${id}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${orderByTableId}/${id}`
      );
      return response.data;
    },
  });

  // Filter orders by status
  const filterByStatus = (status: string) => {
    return data?.orderItem?.filter((item: any) => item.status === status);
  };

  // Get orders for each status
  const newOrders = filterByStatus(orderStatus.pending) || [];
  const activeOrders = filterByStatus(orderStatus.accepted) || [];
  const completedOrders = filterByStatus(orderStatus.completed) || [];

  return (
    <>
      <Paper p="md" mt={10}>
        <Title size="h3" c="#ff6347" ta="center">
          Table No 1
        </Title>

        {/* New Orders */}
        <Paper p="md" shadow="md" bg="#f3f1f1" mt={20}>
          <Group justify="space-between">
            <Text c="#ff702a" fw={600}>
              New Orders ({newOrders.length})
            </Text>
            <FaCaretDown
              size={30}
              color="#ff702a"
              onClick={() => setShowNewOrders((prevState) => !prevState)}
              style={{ cursor: "pointer" }}
            />
          </Group>
        </Paper>

        {showNewOrders &&
          newOrders.length > 0 &&
          newOrders.map((item: any, index: any) => (
            <Paper key={index} p="md" shadow="md" mt={20}>
              <Group justify="space-between">
                <Group>
                  <Image
                    src="/img/burger.jpeg"
                    w={80}
                    h={80}
                    radius={5}
                    alt="Burger"
                  />
                  <Box>
                    <Text>Order ID:{item.id} </Text>
                    <Text>Total Items: {item.quantity}</Text>
                  </Box>
                </Group>
                <Button
                  radius="xl"
                  color="#ff702a"
                  onClick={() => navigate("/view-order")}
                >
                  View Order
                </Button>
              </Group>
            </Paper>
          ))}

        {/* Active Orders */}
        <Paper p="md" shadow="md" bg="#f3f1f1" mt={20}>
          <Group justify="space-between">
            <Text c="#ff702a" fw={600}>
              Active Orders ({activeOrders.length})
            </Text>
            <FaCaretDown
              size={30}
              color="#ff702a"
              onClick={() => setShowActiveOrders((prevState) => !prevState)}
              style={{ cursor: "pointer" }}
            />
          </Group>
        </Paper>

        {showActiveOrders &&
          activeOrders.length > 0 &&
          activeOrders.map((item: any, index: any) => (
            <Paper key={index} p="md" shadow="md" mt={20}>
              <Group justify="space-between">
                <Group>
                  <Image
                    src="/img/burger.jpeg"
                    w={80}
                    h={80}
                    radius={5}
                    alt="Burger"
                  />
                  <Box>
                    <Text>Order ID: {item.orderId}</Text>
                    <Text mt={5}>Total Items: {item.orderItemCount}</Text>
                  </Box>
                </Group>
                <Box>
                  <Button variant="outline" radius="xl" color="#ff702a">
                    Active
                  </Button>
                  <Text c="#ff702a" mt={20} fw={600}>
                    Rs 2500
                  </Text>
                </Box>
              </Group>
            </Paper>
          ))}

        {/* Completed Orders */}
        <Paper p="md" shadow="md" bg="#f3f1f1" mt={20}>
          <Group justify="space-between">
            <Text c="#ff702a" fw={600}>
              Completed Orders ({completedOrders.length})
            </Text>
            <FaCaretDown
              size={30}
              color="#ff702a"
              onClick={() => setShowCompletedOrders((prevState) => !prevState)}
              style={{ cursor: "pointer" }}
            />
          </Group>
        </Paper>

        {showCompletedOrders &&
          completedOrders.length > 0 &&
          completedOrders.map((item: any, index: any) => (
            <Paper key={index} p="md" shadow="md" mt={20}>
              <Group justify="space-between">
                <Group>
                  <Image
                    src="/img/burger.jpeg"
                    w={80}
                    h={80}
                    radius={5}
                    alt="Burger"
                  />
                  <Box>
                    <Text>Order ID: {item.orderId}</Text>
                    <Text mt={5}>Total Items: {item.orderItemCount}</Text>
                  </Box>
                </Group>
                <Box>
                  <Button variant="outline" radius="xl" color="#11c218">
                    Completed
                  </Button>
                  <Text c="#ff702a" mt={20} fw={600}>
                    Rs 2500
                  </Text>
                </Box>
              </Group>
            </Paper>
          ))}
      </Paper>
    </>
  );
};

export default OrderDetails;
