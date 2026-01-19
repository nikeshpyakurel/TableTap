import { Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";

export default function Sales({ data }) {
  return (
    <Paper p={20} withBorder shadow="md" bg={"#F8F8FF"}>
      <Text c={"#36454F"} fz={18} fw={"bold"}>
        Sales
      </Text>
      <Stack gap={2} mt={10}>
        {/* Daily Sales */}
        <Paper withBorder pt={20} pb={20} pl={40} pr={40} shadow="md">
          <Group justify="space-between" c={"dimmed"}>
            <Text size="xs" fw={700} tt={"uppercase"}>
              Daily Sales
            </Text>
            <LiaMoneyCheckAltSolid size={20} />
          </Group>

          <Group align="flex-end" gap="xs" mt={16}>
            <Text fz={24} fw={700} lh={1} c={"#FF6347"}>
              Rs. {data?.day?.totalSalesAmount}
            </Text>
            <Flex c={data?.day?.percentageChange > 0 ? "teal" : "red"}>
              <Text>{data?.day?.percentageChange}%</Text>
            </Flex>
          </Group>
        </Paper>

        {/* Weekly Sales */}
        <Paper withBorder pt={20} pb={20} pl={40} pr={40} shadow="md">
          <Group justify="space-between" c={"dimmed"}>
            <Text size="xs" fw={700} tt={"uppercase"}>
              Weekly Sales
            </Text>
            <LiaMoneyCheckAltSolid size={20} />
          </Group>

          <Group align="flex-end" gap="xs" mt={16}>
            <Text fz={24} fw={700} lh={1} c={"#FF6347"}>
              Rs. {data?.week?.totalSalesAmount}
            </Text>
            <Flex c={data?.week?.percentageChange > 0 ? "teal" : "red"}>
              <Text>{data?.week?.percentageChange}%</Text>
            </Flex>
          </Group>
        </Paper>

        {/* Monthly Sales */}
        <Paper withBorder pt={20} pb={20} pl={40} pr={40} shadow="md">
          <Group justify="space-between" c={"dimmed"}>
            <Text size="xs" fw={700} tt={"uppercase"}>
              Monthly Sales
            </Text>
            <LiaMoneyCheckAltSolid size={20} />
          </Group>

          <Group align="flex-end" gap="xs" mt={16}>
            <Text fz={24} fw={700} lh={1} c={"#FF6347"}>
              Rs. {data?.month?.totalSalesAmount}
            </Text>
            <Flex c={data?.month?.percentageChange > 0 ? "teal" : "red"}>
              <Text>{data?.month?.percentageChange}%</Text>
            </Flex>
          </Group>
        </Paper>
      </Stack>
    </Paper>
  );
}
