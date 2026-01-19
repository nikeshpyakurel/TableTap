import {
  Avatar,
  Box,
  Button,
  ColorInput,
  Image,
  Modal,
  Stack,
  Text,
  UnstyledButton,
  Group,
  Title,
  Card,
  rem,
  useMantineTheme,
  ColorSwatch,
  ThemeIcon,
  Divider,
  Badge,
} from "@mantine/core";
import { useState } from "react";
import useAuthStore from "../../providers/useAuthStore";
import { axiosPrivateInstance, axiosPublicInstance } from "../../api";
import { resturantInfo } from "../../api/resturantinfo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import DropZone from "../../components/utils/DropZone";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaPalette,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { AxiosError } from "axios";

export default function Profile() {
  const { restaurantId } = useAuthStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<"avatar" | "cover" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("");
  const theme = useMantineTheme();

  const queryClient = useQueryClient();

  const getResturant = async () => {
    const resp = await axiosPublicInstance.get(
      `${resturantInfo}/${restaurantId}`
    );
    return resp.data;
  };

  const updateTheme = async () => {
    const resp = await axiosPrivateInstance.patch("/restaurant/update-info", {
      theme: themeColor,
    });
    return resp.data;
  };

  const themeMutation = useMutation({
    mutationFn: updateTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getResturantInfo"] });
      toast.success("Color theme updated");
    },
    onError: (err: AxiosError<any>) => {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error(err);
    },
  });

  const { data } = useQuery({
    queryKey: ["getResturantInfo"],
    queryFn: getResturant,
    enabled: !!restaurantId,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }
      const url =
        type === "avatar" ? "restaurant/upload-logo" : "restaurant/cover-photo";
      await axiosPrivateInstance.patch(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getResturantInfo"] });
      toast.success(
        `${type === "avatar" ? "Logo" : "Cover photo"} updated successfully`
      );
      setSelectedFile(null);
      setPreview(null);
      close();
    },
    onError: () => {
      toast.error("Failed to upload image");
    },
  });

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedFile(null);
          setPreview(null);
        }}
        title={`Update ${
          type === "avatar" ? "Restaurant Logo" : "Cover Photo"
        }`}
        centered
        size="lg"
        overlayProps={{
          blur: 3,
        }}
      >
        <DropZone
          onDrop={handleDrop}
          currentImageUrl={preview}
          onDelete={() => {
            setSelectedFile(null);
            setPreview(null);
          }}
        />
        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            onClick={() => {
              close();
              setSelectedFile(null);
              setPreview(null);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedFile}
            loading={uploadMutation.isPending}
            onClick={() => uploadMutation.mutate()}
            leftSection={<FaCamera size={14} />}
          >
            Upload
          </Button>
        </Group>
      </Modal>

      <Box p="md">
        <Title order={2} mb="xl" c={theme.primaryColor}>
          Restaurant Profile
        </Title>

        <Card withBorder radius="lg" shadow="sm" p={0} mb="xl">
          {/* Cover Image Section */}
          <Box pos="relative" h={200}>
            <Image
              src={data?.coverImage}
              h="100%"
              w="100%"
              radius="lg"
              style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            />
            <Button
              variant="light"
              size="sm"
              pos="absolute"
              top={20}
              right={20}
              onClick={() => {
                setType("cover");
                open();
              }}
              leftSection={<FaEdit size={14} />}
            >
              Edit Cover
            </Button>
          </Box>

          {/* Profile Section */}
          <Box p="xl">
            <Group align="flex-start" justify="center" gap="xl">
              <Box pos="relative">
                <Avatar
                  size={rem(160)}
                  src={data?.photo}
                  radius="lg"
                  style={{
                    border: `4px solid ${theme.white}`,
                    marginTop: rem(-80),
                    backgroundColor: theme.white,
                  }}
                />
                <UnstyledButton
                  bg={theme.white}
                  p={rem(6)}
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    borderRadius: theme.radius.md,
                    boxShadow: theme.shadows.sm,
                  }}
                  onClick={() => {
                    setType("avatar");
                    open();
                  }}
                >
                  <FaEdit size={16} color={theme.colors.gray[7]} />
                </UnstyledButton>
              </Box>

              <Stack gap="xs" style={{ flex: 1 }}>
                <Title order={3} c={theme.colors.dark[7]}>
                  {data?.name}
                </Title>

                <Group gap="sm" mt={4}>
                  <FaMapMarkerAlt size={14} color={theme.colors.gray[6]} />
                  <Text c="dimmed">{data?.address}</Text>
                </Group>

                <Group gap="sm">
                  <FaPhone size={14} color={theme.colors.gray[6]} />
                  <Text c="dimmed">{data?.phone}</Text>
                </Group>
              </Stack>
            </Group>
          </Box>
        </Card>

        {/* Theme Settings Section */}
        <Card withBorder radius="lg" shadow="sm" p="xl">
          <Group mb="xl" align="center">
            <ThemeIcon size="lg" variant="light" color={themeColor || "blue"}>
              <FaPalette size={18} />
            </ThemeIcon>
            <div>
              <Title order={4} mb={4}>
                Restaurant Branding
              </Title>
              <Text size="sm" c="dimmed">
                Customize your visual identity
              </Text>
            </div>
          </Group>

          <Divider mb="xl" />

          <Stack gap="xl">
            <div>
              <Text fw={500} mb="xs">
                Current Theme Color
              </Text>
              {data?.theme ? (
                <Group gap="sm">
                  <ColorSwatch
                    color={data.theme}
                    size={40}
                    radius="sm"
                    withShadow
                  />
                  <Text>{data.theme.toUpperCase()}</Text>
                </Group>
              ) : (
                <Badge
                  variant="light"
                  color="gray"
                  leftSection={<FaExclamationCircle size={12} />}
                >
                  No theme color set
                </Badge>
              )}
            </div>

            <ColorInput
              label="Select New Theme Color"
              description="This will affect your restaurant's visual style"
              placeholder="Choose a color"
              value={themeColor}
              onChange={setThemeColor}
              swatches={[
                theme.colors.blue[6],
                theme.colors.green[6],
                theme.colors.red[6],
                theme.colors.violet[6],
                theme.colors.cyan[6],
                theme.colors.teal[6],
                theme.colors.orange[6],
                theme.colors.grape[6],
              ]}
              swatchesPerRow={8}
              format="hex"
              maw={400}
              radius="md"
            />

            <Button
              variant={themeColor ? "gradient" : "filled"}
              gradient={
                themeColor
                  ? {
                      from: themeColor,
                      to: themeColor,
                      deg: 15,
                    }
                  : undefined
              }
              color={!themeColor ? "blue" : undefined}
              size="md"
              leftSection={<MdRestaurant size={18} />}
              onClick={() => themeMutation.mutate()}
              loading={themeMutation.isPending}
              disabled={!themeColor}
              fullWidth
              mt="md"
            >
              Update Branding
            </Button>
          </Stack>
        </Card>
      </Box>
    </>
  );
}
