import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Group,
  Image,
  Modal,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { BsCart3 } from "react-icons/bs";
import { GrFormAdd, GrFormSubtract } from "react-icons/gr";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

import Menubar from "../../../components/Menu/Menubar";
import MenuLoader from "../../../components/Loader/MenuLoader";
import AlertComponent from "../../../components/utils/Error/AlertComponent";
import { useCart } from "../../../context/CartContext";
import { axiosPublicInstance } from "../../../api";
import { getIndividualProductInfo } from "../../../api/resturantinfo";
import { useThemeStore } from "../../../providers/useThemeStore";

interface Addon {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

const ItemDetails = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { productId } = useParams();
  const { brandColors } = useThemeStore();
  const navigate = useNavigate();

  const { cartItems, addItemToCart } = useCart();
  const [count, setCount] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const maxLength = 200;

  const [modalOpen, setModalOpen] = useState(false);
  const [currentAddon, setCurrentAddon] = useState<Addon | null>(null);
  const [addonQuantity, setAddonQuantity] = useState(1);

  useEffect(() => {
    const storedAddons = sessionStorage.getItem("selectedAddons");
    try {
      const parsedAddons = JSON.parse(storedAddons || "[]");
      if (Array.isArray(parsedAddons)) {
        setSelectedAddons(parsedAddons);
      }
    } catch {
      setSelectedAddons([]);
    }
  }, []);

  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === productId);
    if (cartItem) {
      setCount(cartItem.quantity);
      setSelectedAddons(cartItem.newAddOn || []);
    } else {
      setCount(1);
      setSelectedAddons([]);
    }
  }, [cartItems, productId]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`individualProductData/${productId}`],
    queryFn: async () => {
      const res = await axiosPublicInstance.get(
        `${getIndividualProductInfo}/${productId}`
      );
      return res.data;
    },
    enabled: !!productId,
  });

  const handleAddonClick = useCallback(
    (addon: Addon) => {
      const existingAddon = selectedAddons.find((a) => a.id === addon.id);

      if (existingAddon) {
        setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id));
      } else {
        setCurrentAddon(addon);
        setAddonQuantity(1);
        setModalOpen(true);
      }
    },
    [selectedAddons]
  );

  const confirmAddonQuantity = useCallback(() => {
    if (!currentAddon) return;
    setSelectedAddons((prev) => [
      ...prev,
      {
        ...currentAddon,
        quantity: addonQuantity,
      },
    ]);

    setModalOpen(false);
    setCurrentAddon(null);
  }, [currentAddon, addonQuantity]);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(1, prev - 1));
  }, []);

  const incrementAddonQuantity = useCallback(() => {
    setAddonQuantity((prev) => Math.min(prev + 1, count));
  }, [count]);

  const decrementAddonQuantity = useCallback(() => {
    setAddonQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const updateCart = useCallback(() => {
    if (!data) return;
    const existingItem = cartItems.find((item) => item.id === productId);

    if (existingItem) {
      const quantityDifference = count - existingItem.quantity;

      addItemToCart(
        {
          ...data,
          quantity: count,
          newAddOn: selectedAddons,
        },
        quantityDifference
      );
    } else {
      addItemToCart(
        {
          ...data,
          quantity: count,
          newAddOn: selectedAddons,
        },
        0
      );
    }
  }, [data, count, selectedAddons, addItemToCart, productId, cartItems]);
  const handleAddToCart = useCallback(() => {
    updateCart();
    navigate("/cart", { state: selectedAddons });
  }, [updateCart, navigate, selectedAddons]);

  //Reactive Price
  const calculateTotalPrice = useCallback(() => {
    if (!data) return 0;
    let totalPrice = data.price * count;

    if (selectedAddons && selectedAddons.length > 0) {
      const addonTotal = selectedAddons.reduce((sum, addon) => {
        return sum + addon.price * (addon.quantity || 1);
      }, 0);
      totalPrice += addonTotal;
    }
    return totalPrice;
  }, [data, count, selectedAddons]);

  if (!productId) return <Text>Item not found</Text>;
  if (isLoading) return <MenuLoader />;
  if (isError)
    return (
      <AlertComponent
        title="Error Occurred"
        message={
          error instanceof Error ? error.message : "Something went wrong"
        }
      />
    );
  if (!isMobile) {
    return (
      <Center mih="100vh">
        <Title size={40} ta="center" c="red">
          Sorry, This page cannot be displayed on larger screens
        </Title>
      </Center>
    );
  }

  return (
    <Box>
      <Image
        h={200}
        src={data?.photo}
        style={{
          borderBottomLeftRadius: "60px",
          borderBottomRightRadius: "60px",
        }}
      />

      <Box p={20}>
        <Title size={20} fw="bold" c={"gray.7"}>
          {data?.name}
        </Title>

        <Text mt={10} size="xl" fw="bold" c={brandColors.primary}>
          Rs {calculateTotalPrice()}
        </Text>

        <Text my={10} c="dimmed">
          {data?.description?.length > maxLength && !showFullDesc
            ? data.description.slice(0, maxLength) + "..."
            : data?.description}
          <br />
          {data?.description?.length > maxLength && (
            <span
              onClick={() => setShowFullDesc(!showFullDesc)}
              style={{
                fontWeight: "bold",
                color: "#e74e03",
                cursor: "pointer",
              }}
            >
              {showFullDesc ? "See Less" : "See More"}
            </span>
          )}
        </Text>

        {data?.productAddons?.length > 0 && (
          <Box>
            <Text my={20} size="lg">
              Additional Options:
            </Text>

            <Flex direction="column" gap="lg">
              {data.productAddons.map((addon) => {
                const selectedAddon = selectedAddons.find(
                  (a) => a.id === addon.id
                );
                return (
                  <Group key={addon.id} p={10} justify="space-between">
                    <Text>{addon.name}</Text>
                    <Group>
                      {selectedAddon && (
                        <Text size="md" c={brandColors.primary}>
                          ×{selectedAddon.quantity || 1}
                        </Text>
                      )}
                      <Text>+ Rs {addon.price}</Text>
                      <Checkbox
                        checked={!!selectedAddon}
                        onChange={() => handleAddonClick(addon)}
                      />
                    </Group>
                  </Group>
                );
              })}
            </Flex>
          </Box>
        )}

        {/* Addon Quantity Modal */}
        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            <Text fw="bold" c={brandColors.primary} ta="center">
              Set Quantity
            </Text>
          }
          centered
          size="sm"
        >
          <Box>
            <Text ta="center" mb={20} fw="bold" c={"gray.7"}>
              {currentAddon?.name} (+ Rs {currentAddon?.price} each)
            </Text>

            <Center>
              <Group>
                <Button
                  onClick={decrementAddonQuantity}
                  variant="outline"
                  color={brandColors.primary}
                  radius="xl"
                  disabled={addonQuantity <= 1}
                  p={0}
                  style={{ width: 40, height: 40 }}
                >
                  <GrFormSubtract size={20} />
                </Button>

                <Text fw="bold" size="xl" mx={20}>
                  {addonQuantity}
                </Text>

                <Button
                  onClick={incrementAddonQuantity}
                  variant="outline"
                  color={brandColors.primary}
                  radius="xl"
                  disabled={addonQuantity >= count}
                  p={0}
                  style={{ width: 40, height: 40 }}
                >
                  <GrFormAdd size={20} />
                </Button>
              </Group>
            </Center>

            <Text ta="center" size="sm" c="dimmed" mt={10}>
              Maximum quantity: {count} (limited by item quantity)
            </Text>

            <Center mt={30}>
              <Button
                onClick={confirmAddonQuantity}
                bg={brandColors.primary}
                size="md"
                radius="xl"
              >
                Confirm
              </Button>
            </Center>
          </Box>
        </Modal>

        <Paper mt={20} p="lg" shadow="xl">
          <Group justify="space-between" wrap="nowrap">
            <Group>
              <GrFormSubtract
                onClick={decrement}
                size={35}
                style={{
                  border: "1px solid black",
                  padding: "2px",
                  borderRadius: "40px",
                  cursor: "pointer",
                }}
              />
              <Text>{count}</Text>
              <GrFormAdd
                onClick={increment}
                size={35}
                style={{
                  border: "1px solid black",
                  padding: 2,
                  borderRadius: "40px",
                  cursor: "pointer",
                }}
              />
            </Group>

            <Button
              onClick={handleAddToCart}
              bg={brandColors.primary}
              px={20}
              size="lg"
              radius="xl"
              leftSection={<BsCart3 size={20} />}
            >
              Add to Cart
            </Button>
          </Group>
        </Paper>
      </Box>

      <Menubar />
    </Box>
  );
};

export default ItemDetails;
