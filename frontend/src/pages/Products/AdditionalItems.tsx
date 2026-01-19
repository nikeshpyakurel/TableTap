import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { useMediaQuery } from "@mantine/hooks";

interface AdditionalOption {
  name: string;
  price: string;
}

interface AdditionalItemsProps {
  handleAdditionalOptionAdd: (additionalOption: AdditionalOption) => void;
  additionalOptions: AdditionalOption[];
  handleAdditionalOptionDelete: (index: number) => void;
}

export default function AdditionalItems({
  handleAdditionalOptionAdd,
  additionalOptions,
  handleAdditionalOptionDelete,
}: AdditionalItemsProps) {
  const isSmallScreen = useMediaQuery("(max-width: 840px)");
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      price: "",
    },
    validate: {
      name: (value) =>
        value.trim().length === 0
          ? "Additional option name cannot be empty"
          : null,
      price: (value) => {
        const numberValue = parseFloat(value);
        return isNaN(numberValue) ? "Cost must be a number" : null;
      },
    },
  });

  return (
    <Box
      pl={isSmallScreen ? 5 : 60}
      pr={isSmallScreen ? 5 : 60}
      pt={isSmallScreen ? 2 : 20}
      pb={isSmallScreen ? 2 : 20}
      mt={20}
    >
      <Divider size={"sm"} mb={20} />
      <Grid>
        <Grid.Col>
          <Grid align="center">
            {!isSmallScreen && (
              <Grid.Col span={4}>
                <Text>Additional Options</Text>
              </Grid.Col>
            )}

            <Grid.Col span={"auto"}>
              <Grid>
                <Grid.Col span={"auto"}>
                  <TextInput
                    placeholder="Options"
                    size="md"
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                  />
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <TextInput
                    placeholder="Cost"
                    size="md"
                    key={form.key("price")}
                    {...form.getInputProps("price")}
                  />
                </Grid.Col>
              </Grid>
            </Grid.Col>
            <Grid.Col>
              <Grid>
                {!isSmallScreen && <Grid.Col span={4}></Grid.Col>}
                <Grid.Col span={"auto"}>
                  <Button
                    size="md"
                    color="green"
                    w={isSmallScreen ? "100%" : ""}
                    leftSection={<IoIosAddCircle />}
                    onClick={(e) => {
                      const errors = form.validate();
                      if (!errors.hasErrors) {
                        //const { name, price } = form.getValues();
                        handleAdditionalOptionAdd(form.getValues());
                        form.reset();
                        e.preventDefault();
                      }
                    }}
                  >
                    Add
                  </Button>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>

      {additionalOptions.length ? (
        <Box mt={30}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Extra Item</Table.Th>
                <Table.Th>Cost</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {additionalOptions.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>Rs. {item.price}</Table.Td>
                  <Table.Td>
                    <Group>
                      <MdDelete
                        cursor={"pointer"}
                        color="red"
                        size={25}
                        onClick={() => handleAdditionalOptionDelete(index)}
                      />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      ) : null}
    </Box>
  );
}
