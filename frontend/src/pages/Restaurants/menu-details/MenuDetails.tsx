import {
  Box,
  Center,
  Flex,
  Grid,
  Image,
  Paper,
  Text,
  Title,
  Tabs,
  Card,
  Stack,
  Button,
} from "@mantine/core";

import { IoIosAddCircle, IoIosMore } from "react-icons/io";
import { useEffect, useState } from "react";
import Menubar from "../../../components/Menu/Menubar";
import { useMediaQuery } from "@mantine/hooks";
import { getCategories, getProducts } from "../../../api/resturantinfo";
import { useQuery } from "@tanstack/react-query";
import MenuLoader from "../../../components/Loader/MenuLoader";
import { useNavigate, useSearchParams } from "react-router-dom";
import useMenuInfo from "../../../context/store";
import { axiosPublicInstance } from "../../../api";
import { Product } from "../../Products/Products";
import { useThemeStore } from "../../../providers/useThemeStore";

const MenuDetails = () => {
  const navigate = useNavigate();
  const isTabletOrSmaller = useMediaQuery("(max-width: 768px)");
  const [searchParams] = useSearchParams();
  const { setRestaurantIdAndTableId, restaurantId } = useMenuInfo();
  const { brandColors } = useThemeStore();
  const [showMore, setShowMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const restaurant = searchParams.get("restaurant");
    const table = searchParams.get("table");
    if (restaurant && table) setRestaurantIdAndTableId(restaurant, table);
  }, [searchParams, setRestaurantIdAndTableId]);

  const getCategory = async () => {
    const { data } = await axiosPublicInstance.get(
      `${getCategories}/${restaurantId}`
    );
    return data;
  };

  const getProductDetails = async () => {
    const { data } = await axiosPublicInstance.get(
      `${getProducts}/${restaurantId}`
    );
    return data;
  };

  const { data: categoriesData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategory,
  });

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["getProducts"],
    queryFn: getProductDetails,
  });

  useEffect(() => {
    if (!productsData) return;
    const filtered = selectedCategory
      ? productsData.filter((p) =>
          p.categories.some((c) => c.id === selectedCategory)
        )
      : productsData;
    setDisplayProducts(filtered);
  }, [productsData, selectedCategory]);

  if (isClient && !isTabletOrSmaller) {
    return (
      <Center mih="100vh">
        <Title size={40} ta="center" c="red">
          Sorry, This page cannot be displayed on larger screens
        </Title>
      </Center>
    );
  }

  if (isCategoryLoading && isProductsLoading) return <MenuLoader />;

  const handleCategoryClick = (categoryId) => setSelectedCategory(categoryId);

  const ProductGrid = ({ products }: { products: Product[] }) => {
    const isAdult = sessionStorage.getItem("isAdult") === "true";
    return (
      <Grid p={2}>
        {products.map((product: Product) => {
          if (product.status !== "available") {
            return null;
          }

          if (product.isAgeRestricted && !isAdult) {
            return null;
          }

          return (
            <Grid.Col key={product.id} span={6}>
              <Card
                withBorder
                shadow="sm"
                radius="md"
                padding="md"
                h={250}
                onClick={() => navigate(`/item-details/${product?.id}`)}
              >
                <Card.Section>
                  <Image
                    src={product?.photo}
                    h={120}
                    alt={product?.name}
                    radius="sm"
                  />
                </Card.Section>
                <Stack gap={4} mt={8}>
                  <Text fw={500} c={brandColors.primaryAccent} lineClamp={1}>
                    {product?.name}
                  </Text>
                  <Text c={brandColors.primaryAccent} fw={"bold"}>
                    Rs {product?.price}
                  </Text>
                </Stack>

                <Button
                  variant="light"
                  color={brandColors.secondary}
                  fullWidth
                  radius="md"
                  mt="auto"
                  rightSection={<IoIosAddCircle size={18} />}
                >
                  Add to cart
                </Button>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    );
  };

  const TabsSection = () => (
    <Tabs
      color={brandColors.primary}
      variant="pills"
      radius="lg"
      defaultValue="all"
    >
      <Tabs.List mb={12} p={10} bg="#e2e8f0" style={{ borderRadius: 40 }}>
        <Flex w={"100%"} justify={"space-between"}>
          <Tabs.Tab value="all" w={120}>
            All
          </Tabs.Tab>
          <Tabs.Tab value="non-veg" w={120}>
            Non-veg
          </Tabs.Tab>
          <Tabs.Tab value="veg" w={120}>
            Veg
          </Tabs.Tab>
        </Flex>
      </Tabs.List>

      <Tabs.Panel value="non-veg">
        <ProductGrid products={displayProducts.filter((p) => !p.isVeg)} />
      </Tabs.Panel>
      <Tabs.Panel value="veg">
        <ProductGrid products={displayProducts.filter((p) => p.isVeg)} />
      </Tabs.Panel>
      <Tabs.Panel value="all">
        <ProductGrid products={displayProducts} />
      </Tabs.Panel>
    </Tabs>
  );

  const CategoryCard = ({
    img,
    label,
    onClick,
  }: {
    img?: string;
    label: string;
    onClick: () => void;
  }) => (
    <Paper
      withBorder
      shadow="sm"
      radius="lg"
      p="xs"
      h={100}
      onClick={onClick}
      style={{
        cursor: "pointer",
        transition: "transform 150ms ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {img ? (
        <Image src={img} miw={50} mih={50} mah={50} maw={50} radius={"lg"} />
      ) : (
        <IoIosMore size={36} style={{ marginBottom: 6 }} />
      )}
      <Text size="xs" fw={600} c="#2a2a2a" ta="center" lineClamp={1} mt={4}>
        {label}
      </Text>
    </Paper>
  );

  const Categories = () => (
    <Box py="sm">
      <Grid>
        <Grid.Col span={3}>
          <CategoryCard
            img="https://www.shutterstock.com/image-photo/burger-tomateoes-lettuce-pickles-on-600nw-2309539129.jpg"
            label="All"
            onClick={() => setSelectedCategory(null)}
          />
        </Grid.Col>

        {categoriesData?.slice(0, 6).map((cat, i) => (
          <Grid.Col key={i} span={3}>
            <CategoryCard
              img={cat.photo}
              label={cat.name}
              onClick={() => handleCategoryClick(cat.id)}
            />
          </Grid.Col>
        ))}

        {!showMore && categoriesData?.length > 6 && (
          <Grid.Col span={3}>
            <CategoryCard label="More" onClick={() => setShowMore(true)} />
          </Grid.Col>
        )}

        {showMore &&
          categoriesData?.slice(6).map((cat, i) => (
            <Grid.Col key={i} span={3}>
              <CategoryCard
                img={cat.photo}
                label={cat.name}
                onClick={() => handleCategoryClick(cat.id)}
              />
            </Grid.Col>
          ))}
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Box py={20} px={20}>
        <Title c={brandColors.primary} order={4} mb={18}>
          Categories
        </Title>

        <Categories />

        <Title c={brandColors.primary} order={4} my={18}>
          {selectedCategory
            ? categoriesData?.find((c) => c.id === selectedCategory)?.name
            : "All Products"}{" "}
          ({displayProducts.length})
        </Title>
        <TabsSection />
        <Menubar />
      </Box>
    </Box>
  );
};

export default MenuDetails;
