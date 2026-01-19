import {
  Box,
  Button,
  Card,
  Center,
  Group,
  Image,
  NumberInput,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
  Modal,
  Checkbox,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { CartItem } from "../../providers/useCartStore";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { ProductAddon } from "../Products/Products";
import { useEffect, useState } from "react";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTableOrderCart } from "../../providers/useTableOrderCart";
import { useNavigate } from "react-router-dom";
import { getPhoneNumber } from "../../api/order";

export default function Cart() {
  const { cart, deleteFromCart, updateCartItem, clearCart, tableId } =
    useTableOrderCart();
  const navigate = useNavigate();
  const [editModalOpen, { open: openEditModal, close: closeEditModal }] =
    useDisclosure();
  const [deleteModal, { open: deleteModalOpen, close: deleteModalClose }] =
    useDisclosure();
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["phoneNumber"],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(
        `${getPhoneNumber}/${tableId}`
      );
      return response.data;
    },
  });

  const form = useForm({
    initialValues: {
      quantity: 1,
      selectedAddons: [] as ProductAddon[],
      customerNumber: "",
      discountPrice: 0,
      specialInstructions: "",
    },
    validate: {
      customerNumber: (value) => {
        if (!value.trim()) {
          return "Phone number is required";
        }
        if (!/^\d+$/.test(value)) {
          return "Phone number must contain only digits";
        }
        if (value.length !== 10) {
          return "Phone number must be exactly 10 digits";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    // Ensure we're setting a string value for customerNumber
    if (data && data.phone) {
      // Convert to string and ensure it's valid before setting
      const phoneStr = String(data.phone);
      form.setFieldValue("customerNumber", phoneStr);
    }
  }, [data]);

  const handleEditClick = (item: CartItem) => {
    setSelectedItem(item);
    form.setValues({
      quantity: item.quantity,
      selectedAddons: item.selectedAddons.length > 0 ? item.selectedAddons : [],
      specialInstructions: form.values.specialInstructions,
      customerNumber: form.values.customerNumber,
      discountPrice: form.values.discountPrice,
    });
    openEditModal();
  };

  const handleDelete = (item: CartItem) => {
    setSelectedItem(item);
    deleteModalOpen();
  };

  const handleUpdate = () => {
    if (selectedItem) {
      const updatedQuantity = form.getValues().quantity;
      const updatedAddons = form.getValues().selectedAddons;
      updateCartItem(selectedItem.product.id, updatedQuantity, updatedAddons);
    }
    closeEditModal();
  };

  const handleAddonChange = (addon: ProductAddon) => {
    const selectedAddons = form.values.selectedAddons;
    if (selectedAddons.some((selected) => selected.id === addon.id)) {
      // If selected, remove it
      form.setFieldValue(
        "selectedAddons",
        selectedAddons.filter((selected) => selected.id !== addon.id)
      );
    } else {
      // If not selected, add it
      form.setFieldValue("selectedAddons", [...selectedAddons, addon]);
    }
  };

  //Place Quick Food Order
  const handelPlaceOrder = async () => {
    const orderInfo = cart.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
      addOn: item.selectedAddons.map((addOn) => ({
        addOnId: addOn.id,
      })),
    }));
    // Convert phone number to integer before sending to backend
    const phoneNumber = form.getValues().customerNumber
      ? parseInt(form.getValues().customerNumber, 10)
      : null;

    const orderData = {
      phone: phoneNumber,
      table: tableId,
      remarks: form.getValues().specialInstructions,
      type: "receptionist",
      orderInfo,
    };
    await axiosPrivateInstance.post("/order", orderData);
  };

  const mutation = useMutation({
    mutationFn: handelPlaceOrder,
    onSuccess: () => {
      toast.success("Order placed successfully");
      queryClient.invalidateQueries({
        queryKey: ["RECEPTIONISToRDERDATA"],
        refetchType: "active",
        exact: true,
      });
      form.reset();
      clearCart();
      navigate("/table-order");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <>
      <Modal
        opened={editModalOpen}
        onClose={closeEditModal}
        title="Edit Cart Item"
      >
        <Box>
          <NumberInput
            label="Quantity"
            value={form.values.quantity}
            min={1}
            placeholder="Enter quantity"
            onChange={(value) =>
              form.setFieldValue("quantity", Number(value) || 1)
            }
          />
          <Text mt={16} fw={"bold"}>
            Addons
          </Text>
          {selectedItem?.product.productAddons.length === 0 ? (
            <Text c="dimmed">No addons found</Text>
          ) : (
            selectedItem?.product.productAddons.map((addOn: ProductAddon) => (
              <Group justify="space-between" key={addOn.id}>
                <Text>{addOn.name}</Text>
                <Group>
                  <Text>+ Rs {addOn.price}</Text>
                  <Checkbox
                    checked={form.values.selectedAddons.some(
                      (selected) => selected.id === addOn.id
                    )}
                    onChange={() => handleAddonChange(addOn)}
                  />
                </Group>
              </Group>
            ))
          )}
        </Box>
        <Group mt={"md"}>
          <Button bg={"#F0F0FA"} onClick={closeEditModal} c={"#939191"}>
            Cancel
          </Button>
          <Button color="orange" bg={"#FF6347"} onClick={handleUpdate}>
            Update
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={deleteModal}
        onClose={deleteModalClose}
        title="Do you want to delete the item from cart?"
      >
        <Box>
          <Text>This action can't be undone!</Text>
          <Group mt={24}>
            <Button variant="outline" onClick={deleteModalClose}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => {
                if (selectedItem) {
                  deleteFromCart(selectedItem.product.id);
                }
                deleteModalClose();
              }}
            >
              Delete
            </Button>
          </Group>
        </Box>
      </Modal>
      <Box>
        <Paper p={20}>
          <Box p={20}>
            <Title order={3}>Selected Items</Title>
            <SimpleGrid mt={10} cols={{ base: 1, sm: 2, lg: 4 }}>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    key={item.product.id}
                  >
                    <Card.Section>
                      <Image
                        src={item.product.photo}
                        mah={200}
                        alt="Product Image"
                      />
                    </Card.Section>

                    <Text mt={10} fw={"bold"}>
                      {item.product.name} ({item.quantity})
                    </Text>

                    <Group
                      mt={10}
                      justify="space-between"
                      align="center"
                      c={"#ff6347"}
                    >
                      <Text fw={"bold"} fz={18}>
                        Rs {item.product.price}
                      </Text>
                      <Group gap={10}>
                        <FaRegEdit
                          onClick={() => handleEditClick(item)}
                          cursor={"pointer"}
                          size={25}
                        />
                        <MdDelete
                          size={25}
                          cursor={"pointer"}
                          onClick={() => handleDelete(item)}
                        />
                      </Group>
                    </Group>
                  </Card>
                ))
              ) : (
                <Text p={10} mt={20}>
                  No Selected Items
                </Text>
              )}
            </SimpleGrid>
            <form
              onSubmit={form.onSubmit(() => {
                mutation.mutate();
              })}
            >
              <Box mt={30}>
                <Stack>
                  <Textarea
                    size="md"
                    placeholder="Write preferences if any"
                    label="Describe any special instructions or preferences"
                    {...form.getInputProps("specialInstructions")}
                  />
                  <Text fw={"bold"} fz={18}>
                    Customer Details
                  </Text>

                  <TextInput
                    label="Customer Number"
                    placeholder="Enter 10-digit phone number"
                    size="md"
                    key={form.key("customerNumber")}
                    {...form.getInputProps("customerNumber")}
                  />

                  <Center mt={20}>
                    <Button
                      size="md"
                      fullWidth={isMobile}
                      type="submit"
                      loading={mutation.isPending}
                    >
                      Place Order
                    </Button>
                  </Center>
                </Stack>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
