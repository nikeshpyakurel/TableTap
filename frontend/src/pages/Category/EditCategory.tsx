import { Box, Button, Group, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { CategoryInterface } from "./Category";
import { useForm } from "@mantine/form";
import { FormValue } from "./AddCategory";
import DropZone from "../../components/utils/DropZone";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface AddCategoryProps {
  category?: CategoryInterface;
  page: number;
  closeEditModal: () => void;
  debouncedSearchTerm: string;
}

export default function EditCategory({
  category,
  closeEditModal,
  page,
  debouncedSearchTerm,
}: AddCategoryProps) {
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState<string | null>(
    category?.photo || null
  );
  const [image, setImage] = useState<File | null>(null); // Store the uploaded file

  const form = useForm<FormValue>({
    mode: "uncontrolled",
    initialValues: {
      categoryName: category?.name || "",
      image: null,
    },
  });

  //Image handeling
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
    setImageUrl(null);
  };

  const updateInfo = async () => {
    try {
      await axiosPrivateInstance.patch(`category/update-info/${category?.id}`, {
        name: form.getValues().categoryName,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  };

  const updateImage = async () => {
    if (image && typeof image === "string") return;
    await axiosPrivateInstance.patch(
      `category/update-photo/${category?.id}`,
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
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const mutation = useMutation({
    mutationFn: async () => {
      await updateInfo();
      if (image && typeof image !== "string") {
        await updateImage();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`categoryof${page}`] });
      queryClient.invalidateQueries({
        queryKey: [`categoryof${debouncedSearchTerm}`],
      });
      toast.success("Category Updated!");
      closeEditModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(() => {
        mutation.mutate();
      })}
    >
      <Box>
        <TextInput
          placeholder="Category Name"
          key={form.key("categoryName")}
          {...form.getInputProps("categoryName")}
          size="lg"
          mb={20}
        />
        <DropZone
          onDrop={handleDrop}
          onDelete={handleDeleteImage}
          currentImageUrl={imageUrl}
        />

        <Group mt={20}>
          <Button color="green" type="submit" loading={mutation.isPending}>
            Update
          </Button>
          <Button variant="outline" onClick={closeEditModal}>
            Cancel
          </Button>
        </Group>
      </Box>
    </form>
  );
}
