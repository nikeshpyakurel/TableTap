import {
  Box,
  Button,
  Center,
  MultiSelect,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";

export default function CreateOffer() {
  return (
    <Paper bg="white" p={20} mt={20} shadow="md" radius="md">
      <Center>
        <Text fw={"bold"} fz={24}>
          Create new offer
        </Text>
      </Center>

      {/* Form */}
      <form>
        <Box mt={20}>
          <TextInput
            label="Enter your offer name"
            placeholder="Offer Name"
            size="md"
          />
          <MultiSelect
            mt={16}
            size="md"
            placeholder="Products"
            label="Products"
          />
          <Button mt={16} fullWidth bg={"orange"} size="md">
            Create Offer
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
