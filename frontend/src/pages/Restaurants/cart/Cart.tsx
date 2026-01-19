import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Image,
  Modal,
  Paper,
  Text,
  TextInput,
  Title,
  Textarea,
} from "@mantine/core";
import { IoChevronBackCircle } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import Menubar from "../../../components/Menu/Menubar";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useState, useMemo } from "react";
import useMenuInfo from "../../../context/store";
import useSocketStore from "../../../context/SocketStore";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { TbShoppingCartX } from "react-icons/tb";
import useGetAd from "../../../hooks/api/getAd";
import { useThemeStore } from "../../../providers/useThemeStore";
import { useForm } from "@mantine/form";

const Cart = () => {
  const navigate = useNavigate();
  const { socketRef } = useSocketStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModalId, setOpenedModalId] = useState<string | null>(null);
  const [instruction, setInstruction] = useState<string>("");
  const { cartItems, clearCartItem, clearCartItems } = useCart();
  const tableId = useMenuInfo((state) => state.tableId);
  const { contactNumber, setContactNumber } = useMenuInfo();
  const { data: adData } = useGetAd("cart");
  const [isloading, setIsLoading] = useState(false);
  const { brandColors } = useThemeStore();

  const form = useForm({
    initialValues: {
      contactNumber: String(contactNumber || ""),
    },
    validate: {
      contactNumber: (value) =>
        value.toString().length !== 10 ? "Invalid phone number" : null,
    },
  });

  // Calculate the total cart value including addons
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      // Base item cost
      let itemTotal = item.price * item.quantity;

      // Add addon costs
      if (item.newAddOn && item.newAddOn.length > 0) {
        const addonCost = item.newAddOn.reduce((sum, addon) => {
          return sum + addon.price * (addon.quantity || 1);
        }, 0);
        itemTotal += addonCost;
      }

      return total + itemTotal;
    }, 0);
  }, [cartItems]);

  // Calculate individual item total (including its addons)
  const calculateItemTotal = (item) => {
    let total = item.price * item.quantity;

    if (item.newAddOn && item.newAddOn.length > 0) {
      const addonTotal = item.newAddOn.reduce((sum, addon) => {
        return sum + addon.price * (addon.quantity || 1);
      }, 0);
      total += addonTotal;
    }

    return total;
  };

  const RemoveStorageCart = () => {
    sessionStorage.removeItem("cartItems");
    sessionStorage.removeItem("selectedAddons");
    clearCartItems();
    close();
  };

  const orderInfo = cartItems.map((order) => ({
    product: order.id,
    quantity: order.quantity,
    addOn:
      order?.newAddOn?.map((addon) => ({
        addOnId: addon.id,
        quantity: Number(addon.quantity) || 1,
      })) || [],
  }));

  const orderNow = () => {
    setIsLoading(true);

    const orderBody = {
      phone: form.getValues().contactNumber,
      table: tableId,
      remarks: instruction,
      type: "table",
      orderInfo,
    };

    socketRef?.emit("createOrder", orderBody);
    socketRef?.on("order", (response) => {
      if (response?.success) {
        setContactNumber(form.getValues().contactNumber);
        navigate("/order-success");
        RemoveStorageCart();
      } else {
        toast.error(response.msg);
      }
      setIsLoading(false);
      socketRef.off("order");
    });
  };

  const handleOpenModal = (id) => {
    setOpenedModalId(id);
  };

  const handleCloseModal = () => {
    setOpenedModalId(null);
  };

  return (
    <Box p={20}>
      <Group align="center" mb={12}>
        <IoChevronBackCircle
          color={`${brandColors.primary}`}
          size={30}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <Title c={brandColors.primary} order={4}>
          Cart
        </Title>
      </Group>

      <Divider mt={10} h={10} />

      <Box mt={20}>
        <Box my={24}>
          {adData?.url && (
            <a
              href={
                adData?.url?.startsWith("http://") ||
                adData?.url?.startsWith("https://")
                  ? adData.url
                  : `https://${adData?.url}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text size="sm" ta={"center"} c={"gray.6"}>
                Advertisement
              </Text>
              <Image src={adData?.image} />
            </a>
          )}
        </Box>
        {cartItems.length === 0 ? (
          <Box ta="center" py={60}>
            <Center>
              <TbShoppingCartX size={50} color="gray" />
            </Center>
            <Text size="lg" fw={600} c="dimmed" mt={16}>
              Your cart is currently empty
            </Text>
            <Text size="sm" c="gray.6" mt={5}>
              Start adding some delicious items to your order!
            </Text>
          </Box>
        ) : (
          <>
            {cartItems.map((item) => (
              <Paper
                key={item?.id}
                shadow="md"
                radius="lg"
                p="md"
                my="md"
                withBorder
                pos={"relative"}
              >
                <Flex
                  gap="md"
                  onClick={() => navigate(`/item-details/${item?.id}`)}
                >
                  <Image
                    radius="md"
                    miw={120}
                    h={120}
                    src={item?.photo}
                    alt={item?.name}
                  />
                  <Box flex={1}>
                    <Flex justify="space-between" mb={5}>
                      <Text fw={600} size="md" c={"gray.8"}>
                        {item?.name} ({item?.quantity})
                      </Text>
                      <FaEdit
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/item-details/${item?.id}`);
                        }}
                        size={20}
                        color={brandColors.primary}
                        style={{ cursor: "pointer" }}
                      />
                    </Flex>

                    <Text c="dimmed" fz="xs">
                      {item?.description?.substring(0, 60)}...
                    </Text>

                    {/* Add-ons Display Section */}
                    {item.newAddOn && item.newAddOn.length > 0 && (
                      <Box mt={8}>
                        <Text size="xs" fw={500} c="dimmed">
                          Add-ons:
                        </Text>
                        {item.newAddOn.map((addon) => (
                          <Flex key={addon.id} justify="space-between" mt={4}>
                            <Text size="xs" c="gray.7">
                              {addon.name} × {addon.quantity || 1}
                            </Text>
                            <Text size="xs" c="gray.7">
                              + Rs {addon.price * (addon.quantity || 1)}
                            </Text>
                          </Flex>
                        ))}
                      </Box>
                    )}

                    <Flex justify="space-between" align="center" mt="sm">
                      <Box>
                        <Text c={brandColors.primary} fw={700} size="xl">
                          Rs {calculateItemTotal(item)}
                        </Text>
                        <Text size="xs" c="dimmed">
                          (Base: Rs {item.price} × {item.quantity}
                          {item.newAddOn &&
                            item.newAddOn.length > 0 &&
                            ` + Add-ons: Rs ${
                              calculateItemTotal(item) -
                              item.price * item.quantity
                            }`}
                          )
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
                <Box pos={"absolute"} bottom={10} right={10}>
                  <MdDelete
                    onClick={() => handleOpenModal(item.id)}
                    size={24}
                    color={brandColors.primary}
                  />
                </Box>

                <Modal
                  opened={openedModalId === item.id}
                  onClose={handleCloseModal}
                  centered
                  withCloseButton={false}
                  radius={"md"}
                >
                  <Text
                    fw="bold"
                    c={brandColors.primary}
                    ta="center"
                    size="lg"
                    mb="xs"
                  >
                    Remove Item
                  </Text>

                  <Text ta="center" size="sm" mb="md">
                    Are you sure you want to remove <b>{item.name}</b> from the
                    cart?
                  </Text>

                  <Group justify="center" mt="md">
                    <Button
                      variant="default"
                      onClick={handleCloseModal}
                      radius="lg"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      bg={brandColors.primary}
                      radius="lg"
                      size="sm"
                      onClick={() => {
                        clearCartItem(item.id);
                        handleCloseModal();
                      }}
                    >
                      Yes, Remove
                    </Button>
                  </Group>
                </Modal>
              </Paper>
            ))}

            {/* Cart Total */}
            <Paper shadow="md" radius="lg" p="md" my="md" withBorder>
              <Flex justify="space-between" align="center">
                <Text fw={600} size="lg" c={"gray.8"}>
                  Cart Total
                </Text>
                <Text c={brandColors.primary} fw={700} size="xl">
                  Rs {cartTotal}
                </Text>
              </Flex>
            </Paper>
          </>
        )}
      </Box>

      <Modal
        opened={opened}
        onClose={close}
        radius="lg"
        centered
        title={
          <Text fw={700} size="lg" c={brandColors.primary}>
            Confirm Your Order
          </Text>
        }
      >
        <Box>
          {/* Order Summary in Modal */}
          <Paper p="xs" withBorder radius="md" mb="md">
            <Text fw={600} size="sm" mb={8}>
              Order Summary
            </Text>
            <Flex justify="space-between">
              <Text size="sm">Total Amount:</Text>
              <Text size="sm" fw={600} c={brandColors.primary}>
                Rs {cartTotal}
              </Text>
            </Flex>
          </Paper>
          <form onSubmit={form.onSubmit(orderNow)}>
            <Textarea
              label="Special Instructions"
              placeholder="e.g., Add more ketchup"
              radius="md"
              autosize
              minRows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              styles={{
                label: { marginBottom: 8, fontWeight: 500 },
              }}
            />

            <TextInput
              withAsterisk
              label="Phone Number"
              placeholder="Enter your mobile number"
              radius="md"
              key={form.key("contactNumber")}
              {...form.getInputProps("contactNumber")}
              my="md"
              styles={{
                label: { marginBottom: 8, fontWeight: 500 },
              }}
            />

            <Flex align="center" gap={8} mt="md">
              <Text size="xs" c="dimmed">
                Your friends can also order using the same number by scanning
                the QR code.
              </Text>
            </Flex>

            <Center mt={40}>
              <Button
                loading={isloading}
                type="submit"
                size="md"
                radius="xl"
                px={40}
                bg={brandColors.primary}
              >
                Place Order
              </Button>
            </Center>
          </form>
        </Box>
      </Modal>

      <Center my={30}>
        {cartItems.length === 0 ? (
          <Button
            radius={"lg"}
            variant="outline"
            color={brandColors.primary}
            size="md"
            onClick={() => {
              navigate("/details");
            }}
          >
            View Menu
          </Button>
        ) : (
          <Button
            disabled={cartItems.length === 0}
            radius={"lg"}
            size="md"
            bg={brandColors.primary}
            onClick={() => {
              open();
            }}
          >
            Check Out (Rs {cartTotal})
          </Button>
        )}
      </Center>

      <Menubar />
    </Box>
  );
};

export default Cart;
