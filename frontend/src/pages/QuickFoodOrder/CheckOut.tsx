import {
  Box,
  Button,
  Card,
  Center,
  Group,
  Image,
  List,
  NumberInput,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
  Modal,
  Checkbox,
  TextInput,
  SimpleGrid,
} from "@mantine/core";
import { CartItem, useCartStore } from "../../providers/useCartStore";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { ProductAddon } from "../Products/Products";
import { useState } from "react";
import { axiosPrivateInstance } from "../../api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";

export default function CheckOut() {
  const { cart, deleteFromCart, updateCartItem, clearCart } = useCartStore();
  const [editModalOpen, { open: openEditModal, close: closeEditModal }] =
    useDisclosure();
  const [deleteModal, { open: deleteModalOpen, close: deleteModalClose }] =
    useDisclosure();
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const form = useForm({
    initialValues: {
      quantity: 1,
      selectedAddons: [] as ProductAddon[],
      customerName: "",
      customerNumber: "",
      customerEmail: "",
      discountPrice: 0, // Non-mandatory
      specialInstructions: "",
    },
    validate: {
      quantity: (value) =>
        value <= 0 ? "Quantity must be greater than zero" : null,
    },
  });

  const handleEditClick = (item: CartItem) => {
    setSelectedItem(item);
    form.setValues({
      quantity: item.quantity,
      selectedAddons: item.selectedAddons.length > 0 ? item.selectedAddons : [],
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
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      addOn: item.selectedAddons.map((addOn) => ({
        addOnId: addOn.id,
      })),
    }));

    const orderData = {
      customerName: form.getValues().customerName,
      phone: +form.getValues().customerNumber,
      orderItems,
    };

    try {
      await axiosPrivateInstance.post("/takeaway-order", orderData);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  };

  const mutation = useMutation({
    mutationFn: handelPlaceOrder,
    onSuccess: () => {
      toast.success("Order placed successfully");
      clearCart();
      navigate("/quick-food-order");
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
            {...form.getInputProps("quantity")}
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
                        mah={150}
                        alt="Product Image"
                      />
                    </Card.Section>

                    <Text mt={10} fw={"bold"}>
                      {item.product.name} ({item.quantity})
                    </Text>

                    <List title="Additional Options" withPadding={false}>
                      {item.selectedAddons.map((addon) => (
                        <List.Item key={addon.id}>
                          {addon.name} - Rs. {addon.price}
                        </List.Item>
                      ))}
                    </List>

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
                        <ProtectComponent
                          requiredPermission={
                            PermissionType.UPDATE_TAKEAWAYORDER
                          }
                        >
                          <FaRegEdit
                            onClick={() => handleEditClick(item)}
                            cursor={"pointer"}
                            size={25}
                          />
                        </ProtectComponent>
                        <ProtectComponent
                          requiredPermission={
                            PermissionType.DELETE_TAKEAWAYORDER
                          }
                        >
                          <MdDelete
                            size={25}
                            cursor={"pointer"}
                            onClick={() => handleDelete(item)}
                          />
                        </ProtectComponent>
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
                if (cart.length > 0) {
                  mutation.mutate();
                } else {
                  toast.error("Cart is empty");
                }
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
                    label="Customer Name"
                    placeholder="Enter customer name"
                    size="md"
                    {...form.getInputProps("customerName")}
                  />
                  <NumberInput
                    label="Customer Number"
                    placeholder="Customer number"
                    size="md"
                    {...form.getInputProps("customerNumber")}
                  />
                  <TextInput
                    label="Customer Email"
                    placeholder="Customer email"
                    size="md"
                    {...form.getInputProps("customerEmail")}
                  />
                  <Text fw={"bold"} fz={18}>
                    Discount
                  </Text>
                  <NumberInput
                    label="Discount Price"
                    placeholder="Rs 200"
                    size="md"
                    {...form.getInputProps("discountPrice")}
                  />
                  <Center mt={20}>
                    <Button
                      size="md"
                      type="submit"
                      fullWidth={isMobile}
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
