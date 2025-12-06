import { Card, Group, Image, Stack, Text } from "@mantine/core";

export interface Item {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  isVeg: boolean;
  orderCount: number;
  status: "available" | "unavailable";
  photo: string;
}

interface TrendingOrderCardProps {
  data: Item;
}

export default function TrendingOrderCard({ data }: TrendingOrderCardProps) {
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Card.Section>
        <Image src={data.photo} h={130} alt={data.name} />
      </Card.Section>

      <Card.Section px={"lg"}>
        <Text mt={10} fz={18} c={"#36454F"} fw="bold">
          {data.name}
        </Text>
      </Card.Section>

      <Card.Section px={"lg"}>
        <Group mt={10} align="center" justify="space-between">
          <Stack gap={4}>
            <Text fw={"bold"}>Orders</Text>
            <Text fw="bold">{data.orderCount}</Text>
          </Stack>
          <Stack gap={4}>
            <Text fw={"bold"}>Sales</Text>
            <Text fw="bold" c={"green"}>
              Rs {data.price * data.orderCount}
            </Text>
          </Stack>
        </Group>
      </Card.Section>
    </Card>
  );
}
