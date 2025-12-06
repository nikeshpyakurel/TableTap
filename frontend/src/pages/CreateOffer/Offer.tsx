import { Box, Button, Flex, Paper, Table, Text } from "@mantine/core";
import { IoAddCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const TABLE_HEADER = ["Offer", "Status", "Action"];
export default function Offer() {
  const navigate = useNavigate();
  return (
    <Box>
      <Flex align={"center"} justify={"space-between"}>
        <Text>Total Offer</Text>
        <Button
          size="md"
          bg={"orange"}
          rightSection={<IoAddCircle size={25} />}
          onClick={() => navigate("/create-offer")}
        >
          Create new offer
        </Button>
      </Flex>
      <Paper bg="white" p={20} mt={20} shadow="md" radius="md" h={"80vh"}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {TABLE_HEADER.map((header) => (
                <Table.Th key={header}>{header}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
        </Table>
      </Paper>
    </Box>
  );
}
