import { Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { FaShoppingCart } from "react-icons/fa";

export default function Orders({ data }) {
  return (
    <Paper p={20} withBorder shadow="md" bg={"#F8F8FF"}>
      <Text c={"#36454F"} fz={18} fw={"bold"}>
        Orders
      </Text>
      <Stack gap={2} mt={10}>
        {/* Daily Order */}
        <Paper withBorder pt={20} pb={20} pl={40} pr={40} shadow="md">
          <Group justify="space-between" c={"dimmed"}>
            <Text size="xs" fw={700} tt={"uppercase"}>
              Daily Order
            </Text>
            <FaShoppingCart size={20} />
          </Group>

          <Group align="flex-end" gap="xs" mt={16}>
            <Text fz={24} fw={700} lh={1} c={"#FF6347"}>
              {data?.dayOrder?.orderCount}
            </Text>
            <Flex c={data?.dayOrder?.percentageChange > 0 ? "teal" : "red"}>
              <Text>{data?.dayOrder?.percentageChange}%</Text>
            </Flex>
          </Group>
        </Paper>

        {/* Weekly Order */}
        <Paper withBorder pt={20} pb={20} pl={40} pr={40} shadow="md">
          <Group justify="space-between" c={"dimmed"}>
            <Text size="xs" fw={700} tt={"uppercase"}>
              Weekly Order
            </Text>
            <FaShoppingCart size={20} />
          </Group>

          <Group align="flex-end" gap="xs" mt={16}>
            <Text fz={24} fw={700} lh={1} c={"#FF6347"}>
              {data?.weekOrder?.orderCount}
            </Text>
            <Flex c={data?.weekOrder?.percentageChange > 0 ? "teal" : "red"}>
              <Text>{data?.weekOrder?.percentageChange}%</Text>
            </Flex>
          </Group>
        </Paper>

        {/* Monthly Order */}
        <Paper withBorder pt={20} pb={20} pl={40} pr={40} shadow="md">
          <Group justify="space-between" c={"dimmed"}>
            <Text size="xs" fw={700} tt={"uppercase"}>
              Monthly Order
            </Text>
            <FaShoppingCart size={20} />
          </Group>

          <Group align="flex-end" gap="xs" mt={16}>
            <Text fz={24} fw={700} lh={1} c={"#FF6347"}>
              {data?.monthOrder?.orderCount}
            </Text>
            <Flex c={data?.monthOrder?.percentageChange > 0 ? "teal" : "red"}>
              <Text>{data?.monthOrder?.percentageChange}%</Text>
            </Flex>
          </Group>
        </Paper>
      </Stack>
    </Paper>
  );
}
