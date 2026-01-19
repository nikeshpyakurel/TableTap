import {
  Button,
  Flex,
  Group,
  MultiSelect,
  NumberInput,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import DropZone from "../../components/utils/DropZone";
import { Product } from "./Products";
import { useForm } from "@mantine/form";
import { FormValues } from "./AddProducts";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertComponent from "../../components/utils/Error/AlertComponent";
import { useImageStore } from "../../providers/useImageStore";
import { AxiosError } from "axios";
import AxiosErrorResponse from "../../type/error";

interface editProductProps {
  product: Product;
  debouncedSearchTerm: string;
  closeEditModal: () => void;
  page: number;
}

export default function EditProduct({
  product,
  closeEditModal,
  page,
  debouncedSearchTerm,
}: editProductProps) {
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.photo || null
  );
  const { setSelectedImage } = useImageStore();
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      productName: product.name,
      category: product.categories.map((cat) => cat.id.toString()) || [],
      isVeg: product.isVeg,
      description: product.description,
      price: product.price,
      image: product.photo,
      isAgeRestricted: product.isAgeRestricted,
    },
  });

  const handleDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setImage(selectedFile);
    form.setFieldValue("image", selectedFile);
    const newImageUrl = URL.createObjectURL(selectedFile);
    setImageUrl(newImageUrl);
  };

  const handleDeleteImage = () => {
    setImage(null);
    form.setFieldValue("image", null);
    setSelectedImage(null);
    setImageUrl(null);
  };

  const updateImage = async () => {
    if (image && typeof image === "string") return;
    await axiosPrivateInstance.patch(
      `product/updatePhoto/${product?.id}`,
      {
        photo: form.getValues().image,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const updateInfo = async () => {
    const {
      productName,
      description,
      price,
      isVeg,
      category,
      isAgeRestricted,
    } = form.getValues();
    try {
      await axiosPrivateInstance.patch(`product/${product?.id}`, {
        name: productName,
        description,
        price,
        isVeg,
        categoryIds: category,
        isAgeRestricted,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  };

  const editMutation = useMutation({
    mutationFn: async () => {
      await updateInfo();
      if (image && typeof image !== "string") {
        await updateImage();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`productof${page}`] });
      queryClient.invalidateQueries({
        queryKey: [`productof${debouncedSearchTerm}`],
      });

      toast.success("Product Updated!");
      closeEditModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const categoryData = fetchedCategory?.pagedCategory?.map((category: any) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  //Object URL cleanup
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (isError) {
    const axiosError = error as AxiosError<AxiosErrorResponse>;
    return (
      <AlertComponent
        title="Error Occured"
        message={
          axiosError.response?.data?.message ||
          error.message ||
          "An error occurred"
        }
      />
    );
  }

  return (
    <>
      <form
        onSubmit={form.onSubmit(() => {
          editMutation.mutate();
        })}
      >
        <Flex direction={"column"} gap={20}>
          <TextInput
            label="Product Name"
            size="md"
            key={form.key("productName")}
            {...form.getInputProps("productName")}
          />
          <MultiSelect
            label="Product Category"
            disabled={isLoading}
            data={categoryData}
            clearable
            size="md"
            key={form.key("category")}
            {...form.getInputProps("category")}
          />
          <Switch
            label="Veg"
            size="md"
            {...form.getInputProps("isVeg", { type: "checkbox" })}
          />
          <Textarea
            label="Product Description"
            size="md"
            key={form.key("description")}
            {...form.getInputProps("description")}
          />
          <Switch
            label="18+"
            size="md"
            {...form.getInputProps("isAgeRestricted", { type: "checkbox" })}
          />
          <NumberInput
            size="md"
            label="Product Price"
            key={form.key("price")}
            {...form.getInputProps("price")}
          />
          <DropZone
            onDrop={handleDrop}
            currentImageUrl={imageUrl}
            onDelete={handleDeleteImage}
          />
          <Group mt={"md"}>
            <Button
              type="submit"
              color="green"
              loading={editMutation.isPending}
            >
              Confirm
            </Button>
            <Button variant="outline" color="red" onClick={closeEditModal}>
              Cancel
            </Button>
          </Group>
        </Flex>
      </form>
    </>
  );
}
