import {
  Box,
  Button,
  Divider,
  FileInput,
  Grid,
  List,
  Paper,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { MdOutlineUploadFile } from "react-icons/md";

export default function BulkUpload() {
  const isSmallScreen = useMediaQuery("(max-width: 840px)");

  const productFileUploadForm = useForm({
    initialValues: {
      file: null, // default should be null to handle file
    },
    validate: {
      file: (value) => (value ? null : "File cannot be empty"),
    },
  });

  return (
    <>
      <Paper p={15} pt={2} mt={30}>
        <Box
          pl={isSmallScreen ? 5 : 60}
          pr={isSmallScreen ? 5 : 60}
          pt={isSmallScreen ? 2 : 20}
          pb={isSmallScreen ? 2 : 20}
          mt={20}
        >
          <Text size="xl" mb={20} fw={700}>
            Product Bulk Upload
          </Text>
          <Divider size={"sm"} mb={20} />
          <Box bg={"#cce5ff"} p={25}>
            <List type="ordered">
              <List.Item>
                Download the skeleton file and fill it with proper data.
              </List.Item>
              <List.Item>
                You can download the example file to understand how the data
                must be filled.
              </List.Item>
              <List.Item>
                Once you have downloaded and filled the skeleton file, upload it
                in the form below and submit.
              </List.Item>
              <List.Item>
                After uploading products you need to edit them and set product's
                images and choices.
              </List.Item>
            </List>
          </Box>
          <Button mt={20} w={isSmallScreen ? "100%" : ""}>
            Download CSV
          </Button>
        </Box>
      </Paper>

      <Paper p={15} pt={2} mt={30}>
        <Box
          pl={isSmallScreen ? 5 : 60}
          pr={isSmallScreen ? 5 : 60}
          pt={isSmallScreen ? 2 : 20}
          pb={isSmallScreen ? 2 : 20}
          mt={20}
        >
          <Text size="xl" mb={20} fw={700}>
            Upload Product File
          </Text>
          <Divider size={"sm"} mb={20} />
          <form onSubmit={productFileUploadForm.onSubmit(() => {})}>
            <Grid>
              <Grid.Col>
                <Grid align="center">
                  {!isSmallScreen && <Grid.Col span={4}>Browse</Grid.Col>}
                  <Grid.Col span={"auto"}>
                    <FileInput
                      placeholder="Choose File"
                      leftSection={<MdOutlineUploadFile />}
                      {...productFileUploadForm.getInputProps("file")}
                      size="md"
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col>
                <Grid>
                  {!isSmallScreen && <Grid.Col span={4}></Grid.Col>}
                  <Grid.Col span={"auto"}>
                    <Button type="submit" w={isSmallScreen ? "100%" : ""}>
                      Upload CSV
                    </Button>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </form>
        </Box>
      </Paper>
    </>
  );
}
