import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Modal,
  Paper,
  Select,
  Tabs,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../providers/useAuthStore";
import { useEffect, useRef, useState } from "react";
import useSocketStore from "../../providers/useSocketStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import {
  changeTable,
  orders,
  receptionistOrder,
  tableByStatus,
} from "../../api/order";
import { IoIosNotifications } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";
import { MdCameraswitch } from "react-icons/md";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { toast } from "react-toastify";
import { PermissionType } from "../../type";
import ProtectComponent from "../../route/ProtectComponent";
import useStaffAuthStore from "../../providers/useStaffAuthStore";

const Orders = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { restaurantId, setIsNewOrder } = useAuthStore((state) => state);
  const { permission } = useStaffAuthStore();
  const notificationSound = useRef(new Audio("/audio/audio.mpeg"));
  const { socketRef } = useSocketStore((state) => state);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTableId, setSelectedTableId] = useState("");
  const queryClient = useQueryClient();
  const [switchTableInfo, setSwitchTableInfo] = useState({
    TableName: "",
    OrderId: "",
  });

  const page = 1;
  const pageSize = 10;

  const { isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${orders}?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    },
  });

  const { data: receptionistOrdersData } = useQuery({
    queryKey: ["RECEPTIONIST_ORDER_DATA"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(receptionistOrder, {
        params: { type: "receptionist" },
      });
      return response.data;
    },
  });

  const { data: tableOrderData } = useQuery({
    queryKey: ["TABLE_ORDER_DATA"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(receptionistOrder, {
        params: { type: "table" },
      });
      return response.data;
    },
  });

  // change Table
  const { data: tables } = useQuery({
    queryKey: ["availableTables"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${tableByStatus}?status=available`
      );
      return response.data;
    },
  });

  const handleModelSubmit = (tableName: any, orderId: any) => {
    setSwitchTableInfo({
      TableName: tableName,
      OrderId: orderId,
    });
    open();
  };

  const handleTableChange = async () => {
    const response = await axiosPrivateInstance.patch(
      `${changeTable}/${switchTableInfo.OrderId}?tableId=${selectedTableId}`
    );
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleTableChange,
    onSuccess: () => {
      toast.success("Table Changed Successfully");
      close();
      queryClient.invalidateQueries({
        queryKey: ["orders"],
        refetchType: "active",
        exact: true,
      });
      refetch();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
    },
  });

  const pendingOrders = (order: any): number => {
    return order?.orderItem?.filter((item: any) => item?.status === "pending")
      .length;
  };

  useEffect(() => {
    if (restaurantId) {
      socketRef?.on("order", (message) => {
        if (message.success) {
          setIsNewOrder(true);
          playNotificationSound();
          refetch();
        }
      });
    }
  }, [restaurantId]);

  const playNotificationSound = () => {
    if (notificationSound.current) {
      notificationSound.current.play();
    }
  };

  const renderOrderCard = (item: any, isReceptionist = false) => {
    const hasPendingOrders = pendingOrders(item) > 0;
    return (
      <Paper
        key={item.id}
        p="lg"
        shadow="sm"
        mt={16}
        withBorder
        radius="md"
        style={{
          borderLeft: `${rem(4)} solid ${
            hasPendingOrders ? "#ff6347" : "#e0e0e0"
          }`,
          transition: "all 0.2s ease",
          ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderLeftColor: hasPendingOrders ? "#ff6347" : "#c0c0c0",
          },
        }}
      >
        <Group justify="space-between" align="flex-start" mb="sm">
          <Box>
            <Flex align="center" gap="xs" mb={4}>
              <Text fw={600} size="md">
                {isReceptionist ? "Reception Order" : "Table Order"}
              </Text>
              {hasPendingOrders && (
                <Badge color="red" variant="light" radius="sm" size="sm">
                  New
                </Badge>
              )}
            </Flex>

            <Text size="sm" c="dimmed">
              Table:{" "}
              <Text span fw={500} c="dark.4">
                {item?.session?.table?.name}
              </Text>
            </Text>
          </Box>

          {!isReceptionist && (
            <ProtectComponent
              requiredPermission={PermissionType.UPDATE_TABLEORDER}
            >
              <ActionIcon
                variant="subtle"
                color="#ff6347"
                onClick={() =>
                  handleModelSubmit(item?.session?.table?.name, item?.id)
                }
                size="lg"
                aria-label="Switch table"
              >
                <MdCameraswitch size={20} />
              </ActionIcon>
            </ProtectComponent>
          )}
        </Group>

        <Group justify="space-between" align="center" mt="md">
          <Box>
            <Text size="sm" c="dimmed" mb={4}>
              Total Items:{" "}
              <Text span fw={500}>
                {item.orderItemCount}
              </Text>
            </Text>

            {hasPendingOrders && (
              <Flex align="center" gap="xs">
                <IoIosNotifications color="#ff6347" size={16} />
                <Text size="sm" c="#ff6347" fw={500}>
                  {pendingOrders(item)} pending items
                </Text>
              </Flex>
            )}
          </Box>

          <ActionIcon
            variant="light"
            color="#ff6347"
            size="lg"
            onClick={() =>
              isReceptionist
                ? navigate(`/view-receptionOrder/${item.id}`, { state: item })
                : navigate(`/view-order/${item.session.table.id}`)
            }
            aria-label="View details"
          >
            <FaChevronRight size={18} />
          </ActionIcon>
        </Group>
      </Paper>
    );
  };

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader color="#ff6347" />
      </Center>
    );
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={600}>Switch Table</Text>}
        centered
        radius="md"
      >
        <Flex direction="column" gap="md">
          <Select
            disabled
            placeholder={switchTableInfo.TableName}
            label="Current Table"
            radius="md"
          />
          <Select
            data={tables?.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
            placeholder="Select new table"
            label="New Table"
            value={selectedTableId}
            onChange={(value) => setSelectedTableId(value || "")}
            radius="md"
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close} radius="md">
              Cancel
            </Button>
            <Button
              bg="#ff6347"
              onClick={() => {
                if (selectedTableId) {
                  mutate();
                } else {
                  toast.error("Please select a table to switch to.");
                }
              }}
              loading={isPending}
              radius="md"
            >
              Confirm
            </Button>
          </Group>
        </Flex>
      </Modal>

      <Paper p="md" mt={10} radius="md" shadow="sm">
        <Group justify="space-between" mb="lg">
          <Title order={3} c="#ff6347">
            Orders
          </Title>
          <ProtectComponent
            requiredPermission={
              permission.includes(PermissionType.VIEW_RECEPTIONORDER)
                ? PermissionType.VIEW_RECEPTIONORDER
                : PermissionType.VIEW_TABLEORDER
            }
          >
            <Button
              bg="#ff6347"
              onClick={() => navigate("/order-history")}
              radius="md"
            >
              Order History
            </Button>
          </ProtectComponent>
        </Group>

        <Tabs
          defaultValue={
            !permission?.length
              ? "TableOrders"
              : permission.includes(PermissionType.VIEW_TABLEORDER)
              ? "TableOrders"
              : "ReceptionistOrders"
          }
          variant="pills"
          color="#ff6347"
          radius="md"
        >
          <Tabs.List grow={isMobile}>
            <ProtectComponent
              requiredPermission={PermissionType.VIEW_TABLEORDER}
            >
              <Tabs.Tab value="TableOrders" p={isMobile ? 12 : 16}>
                Table Orders
              </Tabs.Tab>
            </ProtectComponent>

            <ProtectComponent
              requiredPermission={PermissionType.VIEW_RECEPTIONORDER}
            >
              <Tabs.Tab value="ReceptionistOrders" p={isMobile ? 12 : 16}>
                Receptionist
              </Tabs.Tab>
            </ProtectComponent>
          </Tabs.List>

          <Tabs.Panel value="TableOrders" pt="md">
            {tableOrderData?.orders?.length ? (
              tableOrderData?.orders?.map((item: any) =>
                renderOrderCard(item, false)
              )
            ) : (
              <Center p="xl" style={{ minHeight: rem(200) }}>
                <Box ta="center">
                  <Text size="lg" c="dimmed" mb="sm">
                    No table orders available
                  </Text>
                  <Text size="sm" c="dimmed">
                    New table orders will appear here
                  </Text>
                </Box>
              </Center>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="ReceptionistOrders" pt="md">
            {receptionistOrdersData?.orders?.length ? (
              receptionistOrdersData?.orders?.map((item: any) =>
                renderOrderCard(item, true)
              )
            ) : (
              <Center p="xl" style={{ minHeight: rem(200) }}>
                <Box ta="center">
                  <Text size="lg" c="dimmed" mb="sm">
                    No receptionist orders available
                  </Text>
                  <Text size="sm" c="dimmed">
                    New receptionist orders will appear here
                  </Text>
                </Box>
              </Center>
            )}
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {isMobile && (
        <Button
          fullWidth
          mt="md"
          size="md"
          bg="#ff6347"
          onClick={() => navigate("/dashboard")}
          radius="md"
        >
          Go to Dashboard
        </Button>
      )}
    </>
  );
};

export default Orders;
