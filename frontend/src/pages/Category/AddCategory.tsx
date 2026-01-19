import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

//Icons
import { MdCollections } from "react-icons/md";
import DropZone from "../../components/utils/DropZone";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { useIconStore } from "../../providers/useIconStore";
import { MdDelete } from "react-icons/md";

//Interface
export interface FormValue {
  categoryName: string;
  image: File | string | null;
}

export default function AddCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedIcon, setSelectedIcon } = useIconStore();
  const location = useLocation();
  const { formValues } = location.state || {};
  const [image, setImage] = useState<File | string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValue>({
    mode: "uncontrolled",
    initialValues: {
      categoryName: "",
      image: null,
    },
    validate: {
      categoryName: (value) => (value ? null : "Please select a category name"),
      image: (value) => (value ? null : "Please select Image"),
    },
  });
  const isSmallScreen = useMediaQuery("(max-width: 840px)");

  useEffect(() => {
    if (selectedIcon) {
      setImage(selectedIcon);
      form.setFieldValue("image", selectedIcon);
    }
  }, [selectedIcon, form]);

  useEffect(() => {
    if (formValues) {
      const { categoryName } = formValues;
      if (categoryName) {
        form.setFieldValue("categoryName", categoryName);
      }
    }
  });

  const handleDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setImage(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
    form.setFieldValue("image", selectedFile);
  };

  async function postData(values: typeof form.values) {
    const { categoryName, image } = values;
    await axiosPrivateInstance.post(
      "/category",
      {
        name: categoryName,
        photo: image,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success("Category Added");
    form.reset();
    navigate("/category");
  }

  const handleDeleteIcon = () => {
    setImage(null);
    form.setFieldValue("image", null);
    setSelectedIcon(null);
    setImagePreview(null);
  };

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      handleDeleteIcon();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
      <Center>
        <Text fz={30} fw={700} c={"#3d3d3d"}>
          New Category
        </Text>
      </Center>
      <Paper p={15} pt={2} mt={30}>
        <Box
          pl={isSmallScreen ? 5 : 60}
          pr={isSmallScreen ? 5 : 60}
          pt={isSmallScreen ? 2 : 20}
          pb={isSmallScreen ? 2 : 20}
          mt={20}
        >
          <Text size="xl" mb={20} fw={700}>
            Category Information
          </Text>
          <Divider size={"sm"} mb={20} />
          <Grid>
            <Grid.Col>
              <Grid align="center">
                {!isSmallScreen && (
                  <Grid.Col span={4}>
                    <Text>Category Name</Text>
                  </Grid.Col>
                )}

                <Grid.Col span={"auto"}>
                  <TextInput
                    placeholder="Category Name"
                    key={form.key("categoryName")}
                    {...form.getInputProps("categoryName")}
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
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
            Upload Category Icon
          </Text>
          <Divider size={"sm"} mb={20} />
          {selectedIcon ? (
            <Flex direction="column" align="center" gap={40}>
              <Image
                src={typeof image === "string" ? image : imagePreview}
                alt="Selected icon"
                w={150}
              />
              <Button onClick={handleDeleteIcon} color="red" size="xs">
                <MdDelete size={25} />
              </Button>
            </Flex>
          ) : (
            <DropZone
              onDrop={handleDrop}
              currentImageUrl={imagePreview}
              onDelete={handleDeleteIcon}
            />
          )}
          {image && <Text mt={10} ml={20}></Text>}
          {form.errors.image && (
            <Text c={"red"} ml={20} mt={10}>
              {form.errors.image}
            </Text>
          )}

          {!selectedIcon && (
            <Flex mt={20} direction={"column"} align={"center"} gap={20}>
              <Text fz={18}>or</Text>
              <Button
                size="md"
                leftSection={<MdCollections />}
                w={300}
                color="grey"
                // onClick={() => navigate("/icon-library")}
                onClick={() => {
                  navigate("/icon-library", {
                    state: {
                      formValues: form.getValues(),
                    },
                  });
                }}
              >
                Select from our icon library
              </Button>
            </Flex>
          )}
        </Box>
      </Paper>
      <Group justify={isSmallScreen ? "center" : "flex-end"}>
        <Button
          loading={mutation.isPending}
          type="submit"
          bg={"green"}
          mt={20}
          size={"lg"}
          w={isSmallScreen ? "100%" : ""}
        >
          Save
        </Button>
      </Group>
    </form>
  );
}
