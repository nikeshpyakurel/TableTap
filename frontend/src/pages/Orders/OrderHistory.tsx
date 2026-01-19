import {
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Pagination,
  Paper,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { orderHistory } from "../../api/order";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Fetch order history with pagination
  const { data, isLoading, isError } = useQuery({
    queryKey: [`OrderHistory${page}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${orderHistory}?page=${page}&pageSize=${PAGE_SIZE}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Center mt={50}>
        <Loader color="blue" variant="oval" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Text mt={20} c="red">
        Failed to load order history.
      </Text>
    );
  }

  return (
    <>
      <Paper p="md" mt={10}>
        <Group justify="space-between">
          <Title size="h3" c="#ff6347">
            Order History
          </Title>
          <ProtectComponent
            requiredPermission={PermissionType.VIEW_TAKEAWAYORDER}
          >
            <Button bg="#ff6347" onClick={() => navigate("/quick-orders")}>
              Quick Orders
            </Button>
          </ProtectComponent>
        </Group>

        {/* Order List */}
        <Table highlightOnHover mt={32}>
          <Table.Thead>
            <Table.Th>Order</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Date</Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {data?.pagedOrders.map((item: any) => (
              <Table.Tr>
                <Table.Td>
                  <Text mt={10}>
                    Order code{" "}
                    <span
                      style={{ color: "#ff6347", cursor: "pointer" }}
                      onClick={() => navigate("/history-details/" + item.id)}
                    >
                      {item.id}
                    </span>{" "}
                    has been placed
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Badge
                    color={item?.type === "receptionist" ? "blue" : "green"}
                  >
                    {item?.type}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text mt={5} size="sm">
                    {item?.createdAt.slice(0, 10)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Pagination
          value={page}
          total={Math.ceil(data?.total / PAGE_SIZE)}
          onChange={setPage}
          mt={20}
        />
      </Paper>
    </>
  );
};

export default OrderHistory;
