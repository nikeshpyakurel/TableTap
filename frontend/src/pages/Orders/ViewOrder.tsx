import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import {
  acceptedTableOrder,
  acceptOrder,
  orderByTableId,
} from "../../api/order";
import { toast } from "react-toastify";
import { useState } from "react";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";
import { IoMdClipboard } from "react-icons/io";
import { MdCancel, MdCheck, MdInfo, MdReceipt } from "react-icons/md";

const ViewOrder = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState("accepted");
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`PendingOrder${id}`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${orderByTableId}/${id}?status="pending"`
      );
      return response.data;
    },
  });

  // Fetch accepted orders based on status
  const { data: acceptedOrderData, isLoading: isLoadingAcceptedOrder } =
    useQuery({
      queryKey: [`acceptOrder${status}`],
      queryFn: async () => {
        const response = await axiosPrivateInstance.get(
          `${acceptedTableOrder}/${id}?status=${status}`
        );
        return response.data;
      },
      enabled: !!status,
    });

  console.log("Accepted Order Data: ", acceptedOrderData);

  // Handle accepting an order
  const handleAcceptOrder = async (status: string) => {
    const response = await axiosPrivateInstance.patch(
      `${acceptOrder}/${data.order.id}?status=${status}`
    );
    return response;
  };

  // Handle rejecting an order
  const handleRejectOrder = async (id: string) => {
    try {
      const response = await axiosPrivateInstance.patch(
        `${acceptOrder}/orderItem/${id}?status=cancelled`
      );
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  };

  const { mutate: rejectSingle } = useMutation({
    mutationFn: handleRejectOrder,
    onMutate: (itemId) => {
      setLoadingItemId(itemId);
    },

    onSuccess: () => {
      toast.success("Order rejected successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to reject order");
    },
    onSettled: () => {
      setLoadingItemId(null);
    },
  });

  // Accept order mutation
  const { mutate, isPending } = useMutation({
    mutationFn: handleAcceptOrder,
    onSuccess: () => {
      toast.success("Order accepted successfully");
      queryClient.invalidateQueries({ queryKey: [`acceptOrder${status}`] });
      refetch();
    },
    onError: () => {
      toast.error("Failed to accept order");
    },
  });

  const handleOrderStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  if (isLoading) {
    return (
      <Center h={50}>
        <Box>
          <Loader color="blue" />
        </Box>
      </Center>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Paper p="md" mt={10}>
        <Title size="h3" c="#ff6347">
          Order Details
        </Title>

        <Tabs defaultValue="pending" variant="pills" color="#ff6347" mt={24}>
          <Tabs.List>
            <Tabs.Tab
              value="pending"
              onClick={() => handleOrderStatus("pending")}
              p={16}
            >
              New Orders
            </Tabs.Tab>
            <Tabs.Tab
              value="accepted"
              onClick={() => handleOrderStatus("accepted")}
              p={16}
            >
              Accepted Orders
            </Tabs.Tab>
            <Tabs.Tab
              value="cancelled"
              onClick={() => handleOrderStatus("cancelled")}
              p={16}
            >
              Rejected Orders
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="accepted" p="sm">
            {isLoadingAcceptedOrder ? (
              <Center h={300}>
                <Loader color="orange" size="lg" />
              </Center>
            ) : (
              <>
                {acceptedOrderData?.order?.orderItem?.filter(
                  (item: any) => item.status === "accepted"
                ).length > 0 ? (
                  <Stack gap="md" mt="md">
                    {acceptedOrderData?.order?.orderItem
                      .filter((item: any) => item.status === "accepted")
                      .map((item: any, index: any) => (
                        <Paper
                          key={index}
                          p="lg"
                          shadow="sm"
                          radius="md"
                          withBorder
                          style={{
                            transition: "transform 0.2s",
                            ":hover": {
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Group
                            justify="space-between"
                            align="flex-start"
                            wrap="nowrap"
                          >
                            {item.product.photo && (
                              <Image
                                src={item?.product?.photo}
                                w={120}
                                h={120}
                                radius="md"
                                alt={item?.product?.name}
                                style={{ objectFit: "cover" }}
                              />
                            )}

                            <Box style={{ flex: 1 }}>
                              <Group justify="space-between" mb={4}>
                                <Text fw={700} size="lg">
                                  {item?.product?.name}
                                </Text>
                                <Badge
                                  color="green"
                                  variant="light"
                                  radius="sm"
                                >
                                  Accepted
                                </Badge>
                              </Group>

                              <Divider mb="sm" />

                              <Group gap="xl" mb="sm">
                                <Text size="sm">
                                  <Text span fw={600}>
                                    Quantity:
                                  </Text>{" "}
                                  {item.quantity}
                                </Text>
                                <Text size="sm">
                                  <Text span fw={600}>
                                    Price:
                                  </Text>{" "}
                                  Rs {item.product.price}
                                </Text>
                                <Text size="sm">
                                  <Text span fw={600}>
                                    Total:
                                  </Text>{" "}
                                  Rs {item.product.price * item.quantity}
                                </Text>
                              </Group>

                              {item.orderAddOn?.length > 0 && (
                                <Box mt="md">
                                  <Text fw={600} size="sm" mb={4}>
                                    Add-ons:
                                  </Text>
                                  <Stack gap={4}>
                                    {item.orderAddOn.map(
                                      (addOn: any, addOnIndex: any) => (
                                        <Group
                                          key={addOnIndex}
                                          justify="space-between"
                                        >
                                          <Text size="sm">
                                            {addOn?.productAddOn?.name}
                                          </Text>
                                          <Group gap={8}>
                                            <Text size="sm">
                                              Rs {addOn?.productAddOn?.price}
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                              ×
                                            </Text>
                                            <Badge
                                              color="orange"
                                              variant="outline"
                                              radius="sm"
                                              size="sm"
                                            >
                                              {addOn?.quantity}
                                            </Badge>
                                            <Text size="sm" fw={600}>
                                              = Rs{" "}
                                              {addOn?.productAddOn?.price *
                                                addOn?.quantity}
                                            </Text>
                                          </Group>
                                        </Group>
                                      )
                                    )}
                                  </Stack>
                                </Box>
                              )}
                            </Box>
                          </Group>
                        </Paper>
                      ))}
                  </Stack>
                ) : (
                  <Center h={300} bg="gray.0">
                    <Stack align="center" gap={0}>
                      <IoMdClipboard size={48} color="#adb5bd" />
                      <Text c="dimmed" size="lg" mt="md">
                        No accepted orders
                      </Text>
                      <Text c="dimmed" size="sm">
                        Orders you accept will appear here
                      </Text>
                    </Stack>
                  </Center>
                )}

                {acceptedOrderData?.order?.orderItem?.some(
                  (item: any) => item.status === "accepted"
                ) && (
                  <Group justify="flex-end" mt="xl" mb="sm">
                    <ProtectComponent
                      requiredPermission={PermissionType.CREATE_TABLEORDER}
                    >
                      <Button
                        color="#ff6347"
                        size="md"
                        rightSection={<MdReceipt size={18} />}
                        onClick={() =>
                          navigate("/billing", { state: acceptedOrderData })
                        }
                      >
                        Proceed to Billing
                      </Button>
                    </ProtectComponent>
                  </Group>
                )}
              </>
            )}
            <Stack mt="xl" gap="xs">
              {/* Special Instructions Section */}
              <Box>
                <Group gap="xs" align="center" mb={4}>
                  <MdInfo size={18} color="#ff6347" />
                  <Text c="#ff6347" fw={600} size="md">
                    Special instructions or preferences
                  </Text>
                </Group>

                {data?.order?.remarks &&
                acceptedOrderData?.order?.orderItem?.some(
                  (item: any) => item.status === "accepted"
                ) ? (
                  <Paper
                    withBorder
                    p="md"
                    radius="sm"
                    bg="var(--mantine-color-gray-0)"
                  >
                    <Text>{data.order.remarks}</Text>
                  </Paper>
                ) : (
                  <Text mt={2} c="dimmed" size="sm" fs="italic">
                    No special instructions provided
                  </Text>
                )}
              </Box>

              {/* Total Payment Section */}
              <Box mt="lg">
                <Group gap="xs" align="center" mb={4}>
                  <MdReceipt size={18} color="#ff6347" />
                  <Text c="#ff6347" fw={600} size="md">
                    Total Payment
                  </Text>
                </Group>

                <Paper
                  p="md"
                  withBorder
                  radius="sm"
                  bg="var(--mantine-color-gray-0)"
                >
                  <Group justify="space-between" align="center">
                    <Text fw={500} size="md">
                      Order Total:
                    </Text>
                    <Text fw={700} size="xl" c="var(--mantine-color-green-7)">
                      Rs {acceptedOrderData?.totalAmount?.toLocaleString()}
                    </Text>
                  </Group>
                </Paper>
              </Box>
            </Stack>
          </Tabs.Panel>

          {/* Rejected Orders */}
          <Tabs.Panel value="cancelled">
            {data?.order?.orderItem?.filter(
              (item: any) => item.status === "cancelled"
            ).length > 0 ? (
              <Box mt={"lg"}>
                {data.order.orderItem
                  .filter((item: any) => item.status === "cancelled")
                  .map((item: any, index: any) => (
                    <Paper
                      key={index}
                      p="md"
                      shadow="sm"
                      radius="lg"
                      withBorder
                    >
                      <Group align="flex-start" wrap="nowrap">
                        {item.product.photo && (
                          <Image
                            src={item.product.photo}
                            w={80}
                            h={80}
                            fit="contain"
                            radius="md"
                            alt={item.product.name}
                          />
                        )}
                        <Stack gap={4}>
                          <Text fw={600} lineClamp={1}>
                            {item.product.name}
                          </Text>
                          <Group gap="xs">
                            <Text size="sm" c="dimmed">
                              Qty:
                            </Text>
                            <Text size="sm">{item.quantity}</Text>
                          </Group>
                          <Group gap="xs">
                            <Text size="sm" c="dimmed">
                              Price:
                            </Text>
                            <Text size="sm">
                              Rs {item.product.price.toFixed(2)}
                            </Text>
                          </Group>
                          <Badge variant="light" color="red" mt={4} radius="sm">
                            Cancelled
                          </Badge>
                        </Stack>
                      </Group>
                    </Paper>
                  ))}
              </Box>
            ) : (
              <Paper p="xl" radius="md" mt={20} withBorder>
                <Center>
                  <Stack align="center" gap={0}>
                    <MdCancel size={48} color="gray" strokeWidth={1.5} />
                    <Text c="dimmed" size="lg" mt="md">
                      No cancelled orders
                    </Text>
                    <Text c="dimmed" size="sm">
                      Your cancelled orders will appear here
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            )}
          </Tabs.Panel>

          {/* Pending Orders */}
          <Tabs.Panel value="pending">
            {data?.order?.orderItem?.filter(
              (item: any) => item.status === "pending"
            ).length > 0 ? (
              <Stack gap="md" mt="md">
                {data.order.orderItem
                  .filter((item: any) => item.status === "pending")
                  .map((item: any, index: any) => (
                    <Paper
                      key={index}
                      p="lg"
                      shadow="sm"
                      withBorder
                      radius="md"
                    >
                      <Group
                        justify="space-between"
                        align="flex-start"
                        wrap="nowrap"
                      >
                        <Group align="flex-start" gap="lg">
                          {item.product.photo && (
                            <Image
                              src={item.product.photo}
                              w={100}
                              h={100}
                              radius="sm"
                              alt={item.product.name}
                              style={{ objectFit: "cover" }}
                            />
                          )}

                          <Stack gap={4}>
                            <Text fw={700} size="lg">
                              {item.product.name}
                            </Text>
                            <Group gap="xl">
                              <Text size="sm" c="dimmed">
                                Qty: {item.quantity}
                              </Text>
                              <Text size="sm" fw={500}>
                                Rs {item.product.price}
                              </Text>
                            </Group>

                            {item.orderAddOn?.length > 0 && (
                              <Box mt="sm">
                                <Text fw={600} size="sm" mb={4}>
                                  Add-ons:
                                </Text>
                                <Stack gap={2}>
                                  {item.orderAddOn.map(
                                    (addOn: any, addOnIndex: any) => (
                                      <Group key={addOnIndex} gap="xs">
                                        <Text size="sm">
                                          {addOn?.productAddOn?.name}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                          × {addOn?.quantity}
                                        </Text>
                                        <Text size="sm" fw={500}>
                                          Rs {addOn?.productAddOn?.price}
                                        </Text>
                                      </Group>
                                    )
                                  )}
                                </Stack>
                              </Box>
                            )}

                            <Badge
                              color="orange"
                              variant="light"
                              mt="sm"
                              radius="sm"
                            >
                              Pending Approval
                            </Badge>
                          </Stack>
                        </Group>

                        <ProtectComponent
                          requiredPermission={PermissionType.UPDATE_TABLEORDER}
                        >
                          <Button
                            variant="subtle"
                            color="red"
                            size="sm"
                            loading={loadingItemId === item.id}
                            onClick={() => rejectSingle(item.id)}
                          >
                            Reject
                          </Button>
                        </ProtectComponent>
                      </Group>
                    </Paper>
                  ))}
                <Box mt={20}>
                  <Group gap="xs" align="center" mb={4}>
                    <MdInfo size={18} color="#ff6347" />
                    <Text c="#ff6347" fw={600} size="md">
                      Special instructions or preferences
                    </Text>
                  </Group>

                  {data?.order?.remarks ? (
                    <Paper
                      withBorder
                      p="md"
                      radius="sm"
                      bg="var(--mantine-color-gray-0)"
                    >
                      <Text>{data.order.remarks}</Text>
                    </Paper>
                  ) : (
                    <Text mt={2} c="dimmed" size="sm" fs="italic">
                      No special instructions provided
                    </Text>
                  )}
                </Box>

                {data?.order?.orderItem?.some(
                  (item: any) => item.status === "pending"
                ) && (
                  <Group justify="flex-end" mt="md">
                    <ProtectComponent
                      requiredPermission={PermissionType.UPDATE_TABLEORDER}
                    >
                      <Button
                        bg={"#ff6347"}
                        onClick={() => mutate("accepted")}
                        loading={isPending}
                        rightSection={<MdCheck size={18} />}
                      >
                        Accept All Orders
                      </Button>
                    </ProtectComponent>
                  </Group>
                )}
              </Stack>
            ) : (
              <Paper withBorder p="xl" radius="md" mt="md">
                <Center>
                  <Stack align="center" gap={0}>
                    <IoMdClipboard size={40} color="gray" />
                    <Text c="dimmed" mt="sm">
                      No pending orders
                    </Text>
                    <Text size="sm" c="gray.6">
                      New orders will appear here
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            )}
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </>
  );
};

export default ViewOrder;
