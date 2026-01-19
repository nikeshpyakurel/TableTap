import { useState } from "react";
import { Box, Center, Flex, Image, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const data = [
  {
    id: 0,
    title: "Digital Menu Access via QR Code",
    description:
      "Customers can instantly view your restaurant’s full menu by scanning a QR code placed on their table — no app download.",
    image: "img/tab1.webp",
  },
  {
    id: 1,
    title: "Table-Specific Order Management",
    description:
      "Each QR code is linked to a specific table, helping your staff track and manage orders accurately and efficiently.",
    image: "img/tab2.webp",
  },
  {
    id: 2,
    title: "Easy Menu Updates",
    description:
      "You can add, remove, or update menu items anytime through the app, and the changes are reflected immediately for all customers.",
    image: "img/tab3.webp",
  },
];

const ManageOrderTab = () => {
  const [active, setActive] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <Box py={isMobile ? 40 : 60} px={isMobile ? 10 : 20}>
      <Center mb={isMobile ? 30 : 40}>
        <Title
          c="#262338"
          ta="center"
          maw={680}
          fw={600}
          size={isMobile ? "28px" : "37px"}
          lh={isMobile ? "35px" : "50px"}
          lts="3px"
        >
          Use our programmable QR menu & manage your order
        </Title>
      </Center>

      {/* Image area */}
      <Center mb={isMobile ? 30 : 50}>
        <Image
          src={data[active].image}
          alt="Selected screen"
          w={isTablet ? 600 : isMobile ? 350 : 1000}
          h="auto"
          radius="md"
          style={{ transition: "all 0.3s ease-in-out" }}
        />
      </Center>

      {/* Clickable text boxes */}
      <Flex
        direction={isMobile ? "column" : "row"}
        justify="space-between"
        align="start"
        gap="lg"
        maw={1000}
        mx="auto"
      >
        {data.map((item) => (
          <Box
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              cursor: "pointer",
              backgroundColor: active === item.id ? "#FFF1E6" : "#fff",
              borderRadius: 12,
              padding: isMobile ? 12 : 16,
              transition: "all 0.2s ease-in-out",
              border:
                active === item.id ? "2px solid #FFA94D" : "1px solid #ccc",
              flex: isMobile ? "auto" : 1,
            }}
          >
            <Text fw={600} mb={8} c="#262338">
              {item.title}
            </Text>
            <Text size="sm" c="dimmed">
              {item.description}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ManageOrderTab;
