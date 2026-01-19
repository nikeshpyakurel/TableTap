import { Group, Paper, Text } from "@mantine/core";

interface ResturantInfoCardProps {
  icon: JSX.Element;
  title: string;
  data: number;
}

export default function ResturantInfoCard({
  icon,
  title,
  data,
}: ResturantInfoCardProps) {
  return (
    <Paper withBorder pt={20} pb={20} pl={40} pr={40} shadow="md">
      <Text fz={18} fw={700} c={"dimmed"}>
        {title}
      </Text>
      <Group justify="space-between">
        <Text fz={34} fw={700} c={"#FF6347"} mt={10}>
          {data}
        </Text>
        {icon}
      </Group>
    </Paper>
  );
}
