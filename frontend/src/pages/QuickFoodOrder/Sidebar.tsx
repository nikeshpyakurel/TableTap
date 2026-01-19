import { Center, Divider, List, Loader, Paper, Title } from "@mantine/core";
import { CategoryInterface } from "../Category/Category";
import { useState } from "react";

export const Sidebar = ({
  data,
  setSelectedCategory,
  styles,
  isLoading,
  isMobile,
  closeDrawer,
}) => {
  const [activeCategory, setActiveCategory] = useState("");
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveCategory(categoryId);
  };
  console.log("Data: ", data);
  return (
    <Paper
      w={isMobile ? "100%" : "20%"}
      bg="#F0F0FA"
      mih="70vh"
      withBorder
      radius={0}
      mah={""}
    >
      <Title order={4} p={10}>
        Category
      </Title>
      <Divider />
      {isLoading ? (
        <Center mt={40}>
          <Loader size="sm" />
        </Center>
      ) : (
        <List
          listStyleType="none"
          withPadding={false}
          style={{ overflow: "auto" }}
        >
          {data?.map((category: CategoryInterface) => (
            <List.Item
              key={category.id}
              fz={16}
              p={15}
              className={styles.list}
              bg={activeCategory === category.id ? "#FF6347" : ""}
              c={activeCategory === category.id ? "white" : ""}
              onClick={() => {
                handleCategoryClick(category.id);
                setSelectedCategory(category.id);
                closeDrawer();
              }}
            >
              {category.name}
            </List.Item>
          ))}
        </List>
      )}
    </Paper>
  );
};
