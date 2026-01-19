import { Affix, Box, Flex, Paper, Text } from "@mantine/core";
import { NavLink, useLocation } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaCartShopping } from "react-icons/fa6";
import { TbBowlFilled } from "react-icons/tb";
import { RiChatHistoryFill } from "react-icons/ri";
import { useThemeStore } from "../../providers/useThemeStore";

const menuItems = [
  { to: "/menu", icon: GoHomeFill, label: "Home" },
  { to: "/cart", icon: FaCartShopping, label: "Cart" },
  { to: "/details", icon: TbBowlFilled, label: "Menu" },
  { to: "/orders-page", icon: RiChatHistoryFill, label: "History" },
];

const Menubar = () => {
  const location = useLocation();
  const activePath = location.pathname;
  const { brandColors } = useThemeStore();

  return (
    <Box pt={90}>
      <Affix w="95%" position={{ bottom: 4, left: 10 }}>
        <Paper shadow="xl" radius="xl" withBorder>
          <Flex p="sm" px="md" justify="space-around" align="center">
            {menuItems.map(({ to, icon: Icon, label }) => {
              const isActive = activePath === to;
              return (
                <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
                  <Flex direction="column" align="center" gap={2}>
                    <Icon
                      size={32}
                      style={{
                        color: isActive ? `${brandColors.primary}` : "#A0A0A0",
                      }}
                    />
                    <Text
                      size="xs"
                      c={isActive ? `${brandColors.primary}` : "gray.6"}
                      fw={isActive ? 600 : 400}
                    >
                      {label}
                    </Text>
                  </Flex>
                </NavLink>
              );
            })}
          </Flex>
        </Paper>
      </Affix>
    </Box>
  );
};

export default Menubar;
