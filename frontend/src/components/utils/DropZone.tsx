import { Group, Paper, Text, Image, Flex, Box, Center } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { MdDelete } from "react-icons/md";

interface DropZonePropsExtended extends Partial<DropzoneProps> {
  currentImageUrl?: string | null; // Add prop to receive the current image URL
  onDelete: () => void;
}

export default function DropZone({
  currentImageUrl,
  onDelete,
  ...props
}: DropZonePropsExtended) {
  return (
    <Paper
      shadow="md"
      radius={20}
      withBorder={true}
      p={10}
      style={{ cursor: "pointer" }}
    >
      {currentImageUrl ? (
        <Flex align={"center"} justify={"center"} gap={20}>
          <Box>
            <Image
              src={currentImageUrl}
              alt="Current Upload"
              radius="lg"
              mt="md"
              w={200}
            />
            <Center mt={10}>
              <MdDelete color="red" size={25} onClick={() => onDelete()} />
            </Center>
          </Box>
        </Flex>
      ) : (
        <Dropzone
          onDrop={() => {}}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          {...props}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: "none" }}
          >
            <div>
              <Text size="lg" inline>
                Drag images here or click to select files
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}
    </Paper>
  );
}
