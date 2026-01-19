import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Grid,
  Group,
  Input,
  Loader,
  Modal,
  NumberInput,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axiosPrivateInstance } from "../../api";
import { useEffect, useState } from "react";
import styles from "./QuickFoodOrder.module.css";
import { Product, ProductAddon } from "../Products/Products";
import {
  useDebouncedValue,
  useDisclosure,
  useMediaQuery,
} from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../providers/useCartStore";
import { useForm } from "@mantine/form";
import { CategoryDrawer } from "./CategoryDrawer";
import { Sidebar } from "./Sidebar";
import { ActionButtons } from "./ActionButtons";
import { ProductCard } from "./ProductCard";
import useAuthStore from "../../providers/useAuthStore";

export default function QuickFoodOrder() {
  const navigate = useNavigate();
  const [drawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { cart, addToCart, clearCart } = useCartStore();
  const { restaurantId } = useAuthStore();
  const [addOnModal, { open, close }] = useDisclosure();
  const [
    clearCartModal,
    { open: openClearCartModal, close: closeClearCartModal },
  ] = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  //MediaQueries
  const isMobile = useMediaQuery("(max-width: 680px)");
  const isTablet = useMediaQuery("(min-width: 481px) and (max-width: 1024px)");
  //Determine the span of grid based on screen size
  const span = isMobile ? 12 : isTablet ? 6 : 3;
  //Product Search
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 500);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const form = useForm({
    initialValues: {
      quantity: 1,
      selectedAddons: [] as ProductAddon[],
    },
    validate: {
      quantity: (value) =>
        value <= 0 ? "Quantity must be greater than zero" : null,
    },
  });
  // Open add to cart modal
  const addToCartModal = (product: Product) => {
    setSelectedProduct(product);
    const existingCartItem = cart.find(
      (item) => item.product.id === product.id
    );
    const quantity = existingCartItem ? existingCartItem.quantity : 1;
    const selectedAddons = existingCartItem
      ? existingCartItem.selectedAddons
      : [];
    form.setValues({ quantity, selectedAddons });
    open();
  };

  // Fetch all categories
  async function fetchCategory() {
    const res = await axiosPrivateInstance.get("/category/getAll");
    return res.data?.pagedCategory ?? res.data ?? [];
  }
  const { data, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: fetchCategory,
  });

  //Fetch the product of 0 index category in initial render
  useEffect(() => {
    if (data && data.length > 0) {
      const initialCategory = data[0];
      if (initialCategory) {
        setSelectedCategory(initialCategory.id);
      }
    }
  }, [data]);

  // Fetch product by category
  async function fetchProductByCategory(categoryId: string | null) {
    if (!categoryId) return [];
    const res = await axiosPrivateInstance.get(
      `/product/get-by-category/${categoryId}`
    );
    return res.data?.pagedProducts ?? res.data ?? [];
  }

  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryFn: () => fetchProductByCategory(selectedCategory),
    // queryKey: ["product", selectedCategory],
    queryKey: [`productof${selectedCategory}`],
    enabled: !isSearchActive,
  });

  // Search product
  const handelProductSearch = async () => {
    if (debouncedSearchTerm) {
      const res = await axiosPrivateInstance.get(
        `/product/filter/${restaurantId}`,
        {
          params: {
            name: debouncedSearchTerm.trim(),
          },
        }
      );
      return res.data;
    }
    return [];
  };

  const searchQuery = useQuery({
    queryKey: [`productof${debouncedSearchTerm}`],
    queryFn: handelProductSearch,
    enabled: isSearchActive && debouncedSearchTerm.trim() !== "",
  });

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false); // Reset search when input is cleared
    }
  }, [debouncedSearchTerm]);

  const handleAddonChange = (addOn: ProductAddon) => {
    const currentAddons = form.getValues().selectedAddons;
    const updatedAddons = currentAddons.some(
      (selected) => selected.id === addOn.id
    )
      ? currentAddons.filter((selected) => selected.id !== addOn.id)
      : [...currentAddons, addOn];

    form.setFieldValue("selectedAddons", updatedAddons);
  };

  // Add product and selected add-ons to the cart
  const handleAddToCart = () => {
    if (selectedProduct) {
      const existingCartItem = cart.find(
        (item) => item.product.id === selectedProduct.id
      );
      if (existingCartItem) {
        toast.error("This product is already in the cart.");
        close();
        return;
      }
      const quantity = form.getValues().quantity;
      const selectedAddons = form.getValues().selectedAddons;
      addToCart(selectedProduct, selectedAddons, quantity);
      toast.success("Product added to cart");
    }
    close();
  };

  return (
    <>
      <Modal
        opened={addOnModal}
        onClose={() => {
          close();
        }}
        title="Add to cart"
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
          {selectedProduct?.productAddons.length === 0 ? (
            <Text c="dimmed">No addons found</Text>
          ) : (
            selectedProduct?.productAddons?.map((addOn: ProductAddon) => (
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
          <Button
            bg={"#F0F0FA"}
            onClick={() => {
              close();
            }}
            c={"#939191"}
          >
            Cancel
          </Button>
          <Button
            color="orange"
            bg={"#FF6347"}
            onClick={() => {
              handleAddToCart();
            }}
          >
            Add to cart
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={clearCartModal}
        onClose={closeClearCartModal}
        title="Do you want to clear the cart?"
      >
        <Text>This action can't be undone!</Text>
        <Group mt={"md"}>
          <Button
            color="red"
            onClick={() => {
              clearCart();
              closeClearCartModal();
            }}
          >
            Confirm
          </Button>
          <Button variant="outline" onClick={closeClearCartModal}>
            Cancel
          </Button>
        </Group>
      </Modal>

      <Title order={2} ta={"center"}>
        Quick Food Order
      </Title>

      <Paper bg={"white"} p={20} mt={40} shadow="md" radius={"md"}>
        {/*Sidebar for mobile view*/}
        {isMobile && (
          <CategoryDrawer
            drawer={drawer}
            closeDrawer={closeDrawer}
            data={data}
            setSelectedCategory={setSelectedCategory}
            styles={styles}
            isLoading={isLoading}
            isMobile={isMobile}
          />
        )}
        <Flex>
          {/*Sidebar for desktop view */}
          {!isMobile && (
            <Sidebar
              closeDrawer={closeDrawer}
              data={data}
              setSelectedCategory={setSelectedCategory}
              styles={styles}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          )}
          <Box w={isMobile ? "100%" : "80%"} pl={isMobile ? 0 : 10}>
            <Group w={"100%"} justify="space-between">
              <Input
                leftSection={<FaSearch />}
                placeholder="Search for all products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="md"
                w={isMobile || isTablet ? "100%" : "auto"}
              />
              <ActionButtons
                path={"/quick-food-order-checkout"}
                isMobile={isMobile}
                cart={cart}
                openDrawer={openDrawer}
                navigate={navigate}
                openClearCartModal={openClearCartModal}
              />
            </Group>
            <Grid mt={10}>
              {productsLoading ? (
                <Grid.Col span={"auto"}>
                  <Center style={{ height: "80vh" }}>
                    <Loader size="xl" />
                  </Center>
                </Grid.Col>
              ) : (
                <>
                  {(() => {
                    const products =
                      isSearchActive && debouncedSearchTerm.trim() !== ""
                        ? searchQuery.data
                        : allProducts;
                    if (products && products.length > 0) {
                      return searchQuery.isLoading ? (
                        <Text>Searching</Text>
                      ) : (
                        products.map((product: Product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            span={span}
                            isInCart={cart.some(
                              (item) => item.product.id === product.id
                            )}
                            addToCartModal={addToCartModal}
                          />
                        ))
                      );
                    }
                    return (
                      <Grid.Col span={"auto"}>
                        <Center h={"50vh"}>
                          <Text fz={18}>No Products Found</Text>
                        </Center>
                      </Grid.Col>
                    );
                  })()}
                </>
              )}
            </Grid>
          </Box>
        </Flex>
      </Paper>
      {isMobile && (
        <Button
          fullWidth={true}
          mt={16}
          size="md"
          bg={"orange"}
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      )}
    </>
  );
}
