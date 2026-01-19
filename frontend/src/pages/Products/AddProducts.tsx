/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  Switch,
  Text,
  Textarea,
  TextInput,
  Grid,
  MultiSelect,
  NumberInput,
  Flex,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import AdditionalItems from "./AdditionalItems";
import { useMediaQuery } from "@mantine/hooks";
import DropZone from "../../components/utils/DropZone";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertComponent from "../../components/utils/Error/AlertComponent";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useImageStore } from "../../providers/useImageStore";
import { MdCollections, MdDelete } from "react-icons/md";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";

interface AdditionalOptions {
  name: string;
  price: string;
}

export interface FormValues {
  productName: string;
  category: string[];
  isVeg?: boolean;
  description: string;
  price: number;
  image: File | null | string;
  isAgeRestricted: boolean;
}

export default function AddProducts() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { selectedImage, setSelectedImage } = useImageStore();
  const isSmallScreen = useMediaQuery("(max-width: 840px)");
  const [addOns, setAddOns] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalOptions, setAdditionalOptions] = useState<
    AdditionalOptions[]
  >([]);
  const [image, setImage] = useState<File | string | null>(null);
  const location = useLocation();
  const dataFromLocation = location.state || {};
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      productName: "",
      category: [],
      isVeg: true,
      description: "",
      isAgeRestricted: false,
      price: 0,
      image: null,
    },
    validate: {
      productName: (value) =>
        value.trim().length < 4 ? "Name must have at least 4 letters" : null,
      category: (value) =>
        value.length === 0 ? "Please select a category" : null,
      description: (value) => (value ? null : "Sub category cannot be empty"),
      price: (value) => (value ? null : "Price cannot be empty"),
      image: (value) => (value ? null : "Image cannot be empty"),
    },
  });

  function handleAdditionalOptionAdd(additionalOption: AdditionalOptions) {
    setAdditionalOptions([...additionalOptions, additionalOption]);
  }

  function handleAdditionalOptionDelete(index: number) {
    setAdditionalOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== index)
    );
  }

  const handleDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setImage(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
    form.setFieldValue("image", selectedFile);
  };

  const handleDeleteImage = () => {
    setImage(null);
    form.setFieldValue("image", null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (selectedImage) {
      setImage(selectedImage);
      form.setFieldValue("image", selectedImage);
    }
  }, [selectedImage, form]);

  // Persisting form value
  useEffect(() => {
    if (dataFromLocation.formValues) {
      const { formValues, additionalOptions } = dataFromLocation;
      const { productName, category, isVeg, description, price } = formValues;
      if (productName) {
        form.setFieldValue("productName", productName);
      }
      if (category) {
        form.setFieldValue("category", category);
      }
      if (isVeg !== undefined) {
        form.setFieldValue("isVeg", isVeg);
      }
      if (description) {
        form.setFieldValue("description", description);
      }
      if (price) {
        form.setFieldValue("price", Number(price));
      }
      if (additionalOptions.length > 0) {
        setAddOns(true);
        setAdditionalOptions(additionalOptions);
      }
    }
  }, []);

  async function fetchCategory() {
    const res = await axiosPrivateInstance.get("/category/getAll");
    return res.data;
  }

  const {
    data: fetchedCategory,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["category"],
    queryFn: fetchCategory,
  });

  const normalizedCategories = Array.isArray(fetchedCategory)
    ? fetchedCategory
    : Array.isArray(fetchedCategory?.pagedCategory)
    ? fetchedCategory.pagedCategory
    : [];

  const categoryData = normalizedCategories?.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  //Add Product
  const postProduct = async () => {
    const {
      productName,
      description,
      price,
      isVeg,
      category,
      image,
      isAgeRestricted,
    } = form.getValues();
    await axiosPrivateInstance.post(
      "/product/add",
      {
        name: productName,
        description,
        price: Number(price),
        discount: 0,
        isVeg,
        photo: image,
        isAgeRestricted,
        categoryIds: category,
        addOn: additionalOptions,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const mutation = useMutation({
    mutationFn: postProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      form.reset();
      handleDeleteImage();
      navigate("/products");
      toast.success("Product added successfully");
    },
    onError: (error) => toast.error(error.message),
  });
  if (isError) {
    return <AlertComponent title="Error Occurred" message={error.message} />;
  }

  return (
    <>
      <form
        onSubmit={form.onSubmit(() => {
          mutation.mutate();
        })}
      >
        <Center mb={20}>
          <Text fz={30} c={"#3d3d3d"}>
            Add New Product
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
              Product Information
            </Text>
            <Divider size={"sm"} mb={20} />

            <Grid gutter={"xl"}>
              <Grid.Col>
                <Grid align="center" gutter="md">
                  {!isSmallScreen && (
                    <Grid.Col span={4}>
                      <Text>Product Name</Text>
                    </Grid.Col>
                  )}
                  <Grid.Col span={"auto"}>
                    <TextInput
                      placeholder="Product Name"
                      {...(form.getInputProps("productName") || "")}
                      size="md"
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col>
                <Grid align="center">
                  {!isSmallScreen && (
                    <Grid.Col span={4}>
                      <Text>Category</Text>
                    </Grid.Col>
                  )}
                  <Grid.Col span={"auto"}>
                    <ProtectComponent
                      requiredPermission={PermissionType.VIEW_CATEGORY}
                    >
                      <MultiSelect
                        placeholder={
                          isLoading
                            ? "Loading the category..."
                            : "Select Category"
                        }
                        searchable
                        disabled={isLoading}
                        data={categoryData}
                        clearable
                        size="md"
                        key={form.key("category")}
                        {...form.getInputProps("category")}
                        error={form.errors.categFory}
                      />
                    </ProtectComponent>
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col>
                <Grid align="center">
                  <Grid.Col span={isSmallScreen ? 1.5 : 4}>
                    <Text>Veg</Text>
                  </Grid.Col>
                  <Grid.Col span={"auto"}>
                    <Switch
                      size="lg"
                      {...form.getInputProps("isVeg", { type: "checkbox" })}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col>
                <Grid align="center">
                  {!isSmallScreen && (
                    <Grid.Col span={4}>
                      <Text>Description</Text>
                    </Grid.Col>
                  )}
                  <Grid.Col span={"auto"}>
                    <Textarea
                      size="md"
                      placeholder="Enter Product Description"
                      key={form.key("description")}
                      {...form.getInputProps("description")}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col>
                <Grid align="center">
                  <Grid.Col span={isSmallScreen ? 2 : 4}>
                    <Text>18+</Text>
                  </Grid.Col>
                  <Grid.Col span={"auto"}>
                    <Switch
                      size="lg"
                      {...form.getInputProps("isAgeRestricted", {
                        type: "checkbox",
                      })}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col>
                <Grid align="center">
                  {!isSmallScreen && (
                    <Grid.Col span={4}>
                      <Text>Price</Text>
                    </Grid.Col>
                  )}
                  <Grid.Col span={"auto"}>
                    <NumberInput
                      placeholder="Price"
                      key={form.key("price")}
                      {...form.getInputProps("price")}
                      size="md"
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col>
                <Grid align="center">
                  <Grid.Col span={isSmallScreen ? 2 : 4}>
                    <Text>Addons</Text>
                  </Grid.Col>
                  <Grid.Col span={"auto"}>
                    <Switch
                      size="lg"
                      checked={addOns}
                      onChange={(e) => setAddOns(e.currentTarget.checked)}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </Box>
        </Paper>

        {addOns && (
          <Paper mt={20} p={15}>
            <AdditionalItems
              handleAdditionalOptionAdd={handleAdditionalOptionAdd}
              handleAdditionalOptionDelete={handleAdditionalOptionDelete}
              additionalOptions={additionalOptions}
            />
          </Paper>
        )}

        <Paper mt={20} p={15} pt={2}>
          <Box
            pl={isSmallScreen ? 5 : 60}
            pr={isSmallScreen ? 5 : 60}
            pt={isSmallScreen ? 2 : 20}
            pb={isSmallScreen ? 2 : 20}
            mt={20}
          >
            <Text size="xl" mb={20} fw={700}>
              Upload Product Image
            </Text>
            <Divider size={"sm"} mb={20} />
            {selectedImage ? (
              <Flex direction="column" align="center" gap={40}>
                <Image
                  src={typeof image === "string" ? image : imagePreview}
                  alt="Selected icon"
                  style={{ width: 100, height: 100 }}
                />
                <Button onClick={handleDeleteImage} color="red" size="xs">
                  <MdDelete size={20} />
                </Button>
              </Flex>
            ) : (
              <DropZone
                onDrop={handleDrop}
                currentImageUrl={imagePreview}
                onDelete={handleDeleteImage}
              />
            )}
            {form.errors.image && (
              <Text c={"red"} ml={20} mt={10}>
                {form.errors.image}
              </Text>
            )}
          </Box>
          {!selectedImage && (
            <Flex mt={20} direction={"column"} align={"center"} gap={20}>
              <Text fz={18}>or</Text>
              <Button
                size="md"
                leftSection={<MdCollections />}
                w={300}
                color="grey"
                onClick={() => {
                  navigate("/image-library", {
                    state: {
                      formValues: form.getValues(),
                      additionalOptions: additionalOptions,
                    },
                  });
                }}
              >
                Select from our image library
              </Button>
            </Flex>
          )}
        </Paper>

        <Group justify="flex-end" mt={20}>
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
    </>
  );
}
