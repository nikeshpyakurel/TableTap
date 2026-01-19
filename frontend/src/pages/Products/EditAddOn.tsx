import {
  Box,
  Button,
  Grid,
  Group,
  Modal,
  NumberInput,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { Product } from "./Products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

interface editProductProps {
  product: Product;
}

interface AddOns {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditAddOn({ product }: editProductProps) {
  //Disclosure for modals
  const [deleteModal, { open: deleteModalOpen, close: deleteModalClose }] =
    useDisclosure();
  const [editModal, { open: editModalOpen, close: editModalClose }] =
    useDisclosure();
  const [selectedAddonId, setSelectedAddonId] = useState<string>("");
  const [selectedAddon, setSelectedAddon] = useState<AddOns | null>(null); // Add state for editing
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: "",
      price: 0,
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "Name cannot be empty" : null,
      price: (value) => (value <= 0 ? "Price must be greater than 0" : null),
    },
  });

  //Add Addons
  const postAddOns = async () => {
    const { name, price } = form.getValues();
    await axiosPrivateInstance.post(`/product/create-Addon/${product.id}`, {
      name,
      price,
    });
  };

  const addOnMutation = useMutation({
    mutationFn: postAddOns,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addon"] });
      form.reset();
      toast.success("Addon added successfully");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
    },
  });

  //Delete Addons
  const openDeleteModal = (id: string) => {
    setSelectedAddonId(id);
    deleteModalOpen();
  };

  const handelAddOnsDelete = async (id: string) => {
    await axiosPrivateInstance.delete(`/product/Addon/${id}`);
  };

  const addonDeleteMutation = useMutation({
    mutationFn: handelAddOnsDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addon"] });
      toast.success("Addon deleted");
      deleteModalClose();
    },
    onError: (err: any) =>
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      ),
  });

  //Fetch Addons
  const fetchAddOns = async () => {
    const res = await axiosPrivateInstance.get(`/product/${product.id}`);
    return res.data.productAddons;
  };

  const { data, isLoading } = useQuery({
    queryFn: fetchAddOns,
    queryKey: ["addon"],
  });

  // Edit Addon
  const openEditModal = (addon: AddOns) => {
    setSelectedAddon(addon);
    form.setValues({
      name: addon.name,
      price: addon.price,
    });
    editModalOpen();
  };

  const handleAddOnEdit = async () => {
    if (selectedAddon) {
      const { name, price } = form.getValues();
      await axiosPrivateInstance.patch(`/product/Addon/${selectedAddon.id}`, {
        name,
        price,
      });
    }
  };

  const editAddOnMutation = useMutation({
    mutationFn: handleAddOnEdit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addon"] });
      toast.success("Addon updated successfully");
      editModalClose();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <>
      {/* Delete Modal */}
      <Modal
        opened={deleteModal}
        onClose={deleteModalClose}
        title="Confirm Action"
      >
        <Text>Do you want to delete Addons?</Text>
        <Group mt={"md"}>
          <Button
            color="red"
            loading={addonDeleteMutation.isPending}
            onClick={() => {
              if (selectedAddonId) {
                addonDeleteMutation.mutate(selectedAddonId);
              }
            }}
          >
            Confirm
          </Button>
          <Button variant="outline" onClick={deleteModalClose}>
            Cancel
          </Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      <Modal opened={editModal} onClose={editModalClose} title="Edit Add-on">
        <form onSubmit={form.onSubmit(() => editAddOnMutation.mutate())}>
          <TextInput
            label="Option Name"
            placeholder="Option Name"
            size="md"
            {...form.getInputProps("name")}
          />
          <NumberInput
            mt={15}
            label="Option Price"
            placeholder="Option Price"
            size="md"
            {...form.getInputProps("price")}
          />
          <Group mt={"md"}>
            <Button
              type="submit"
              color="green"
              loading={editAddOnMutation.isPending}
            >
              Confirm
            </Button>
            <Button variant="outline" onClick={editModalClose}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Add Add-on Form */}
      <form onSubmit={form.onSubmit(() => addOnMutation.mutate())}>
        <Box>
          <Grid mt={10}>
            <Grid.Col>
              <Grid align="center">
                <Grid.Col span={"auto"}>
                  <Grid>
                    <Grid.Col span={"auto"}>
                      <TextInput
                        placeholder="Option Name"
                        size="md"
                        key={form.key("name")}
                        {...form.getInputProps("name")}
                      />
                    </Grid.Col>
                    <Grid.Col span={"auto"}>
                      <NumberInput
                        placeholder="Option Price"
                        size="md"
                        key={form.key("price")}
                        {...form.getInputProps("price")}
                      />
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col>
                  <Grid>
                    <Grid.Col span={"auto"}>
                      <Button
                        type="submit"
                        loading={addOnMutation.isPending}
                        size="md"
                        color="green"
                        w={"100%"}
                        leftSection={<IoIosAddCircle />}
                      >
                        Add
                      </Button>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>

          {/* Add-ons Table */}
          <Table mt={10}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={3} style={{ textAlign: "center" }}>
                    Loading Add-Ons...
                  </Table.Td>
                </Table.Tr>
              ) : (
                data?.map((item: AddOns) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>Rs. {item.price}</Table.Td>
                    <Table.Td>
                      <Group align="center">
                        <MdDelete
                          cursor={"pointer"}
                          color="red"
                          size={25}
                          onClick={() => openDeleteModal(item.id)}
                        />
                        <FaRegEdit
                          size={20}
                          color="orange"
                          cursor={"pointer"}
                          onClick={() => openEditModal(item)}
                        />
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </form>
    </>
  );
}
