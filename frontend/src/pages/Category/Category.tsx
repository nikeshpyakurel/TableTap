import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Input,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Switch,
  Table,
  Text,
} from "@mantine/core";
import { Pagination } from "@mantine/core";
// Icons
import { IoAddCircle } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertComponent from "../../components/utils/Error/AlertComponent";
import { useEffect, useState } from "react";
import ConfirmModal from "../../components/utils/Modal/ConfirmModal";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import EditCategory from "./EditCategory";
import useAuthStore from "../../providers/useAuthStore";
import { toast } from "react-toastify";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";

export interface CategoryInterface {
  id: string;
  name: string;
  photo: string;
  status: "available" | "unavailable";
  createdAt: string;
  updatedAt: string;
}

// Global Variables
const PAGE_SIZE = 12;

export default function Category() {
  const [opened, { open, close }] = useDisclosure(false);
  const { restaurantId } = useAuthStore();
  const [editModal, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  useDisclosure(false);
  const headers = ["Name", "Image", "Status", "Edit"];
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    status: "available" | "unavailable";
  } | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  //Product Search
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 500);
  const [isSearchActive, setIsSearchActive] = useState(false);

  async function fetchCategory() {
    try {
      const res = await axiosPrivateInstance.get("/category/getAll", {
        params: {
          page: page,
          pageSize: PAGE_SIZE,
        },
      });
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  }

  //update category status
  async function updateCategoryStatus(id: string, status: string) {
    try {
      const res = await axiosPrivateInstance.patch(
        `/category/update-info/${id}`,
        { status }
      );
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  }

  /**************Status Change******************/
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCategoryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`categoryof${page}`] });
      queryClient.invalidateQueries({
        queryKey: [`categoryof${debouncedSearchTerm}`],
      });
      setIsConfirming(false); // Reset confirming state
      setModalOpened(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsConfirming(false);
      return <AlertComponent title="Error Occurred" message={error.message} />;
    },
  });

  // Show the confirmation modal
  const handleStatusChangeRequest = (
    id: string,
    currentStatus: "available" | "unavailable"
  ) => {
    const newStatus =
      currentStatus === "available" ? "unavailable" : "available";
    setSelectedCategory({ id, status: newStatus });
    setModalOpened(true);
  };

  const confirmStatusChange = () => {
    if (selectedCategory) {
      setIsConfirming(true);
      statusMutation.mutate({
        id: selectedCategory.id,
        status: selectedCategory.status,
      });
    }
  };

  /************** Delete Category******************/

  async function handleProductDelete(id: string) {
    try {
      const res = await axiosPrivateInstance.delete(`/category/${id}`, {});
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleProductDelete,
    onSuccess: () => {
      toast.success("Category Deleted");
      queryClient.invalidateQueries({ queryKey: [`categoryof${page}`] });
      queryClient.invalidateQueries({
        queryKey: [`categoryof${debouncedSearchTerm}`],
      });
      close();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
      return (
        <AlertComponent
          title="Error Occurred"
          message={
            err.response?.data?.message || err.message || "An error occurred"
          }
        />
      );
    },
  });

  const openDeleteModal = (id: string) => {
    setSelectedCategoryId(id);
    open();
  };

  const editModalOpen = (id: string) => {
    const selectedCategory = data.pagedCategory?.find(
      (category: CategoryInterface) => category.id === id
    );
    if (selectedCategory) {
      setSelectedCategoryId(id);
      openEditModal();
    }
  };

  //Category Search
  const handelProductSearch = async () => {
    const trimmedSearch = debouncedSearchTerm.trim();
    if (trimmedSearch) {
      const res = await axiosPrivateInstance.get(
        `/category/filter/${restaurantId}`,
        {
          params: {
            category: trimmedSearch,
          },
        }
      );
      return res.data;
    }
    return [];
  };

  const searchQuery = useQuery({
    queryKey: [`categoryof${debouncedSearchTerm}`],
    queryFn: handelProductSearch,
    enabled: isSearchActive && debouncedSearchTerm.trim() !== "",
  });

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  }, [debouncedSearchTerm]);

  /**************Fetch Category******************/
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`categoryof${page}`],
    queryFn: fetchCategory,
    enabled: !isSearchActive,
  });

  if (isError) {
    return <AlertComponent title="Error Occurred" message={error.message} />;
  }

  return (
    <>
      {/******************Delete Confirm Modal****************/}
      <Modal opened={opened} onClose={close} title="Confirm Action">
        <Text>Do you want to delete the category?</Text>
        <Group mt={"md"}>
          <Button
            color="red"
            loading={isPending}
            onClick={() => {
              if (selectedCategoryId) {
                mutate(selectedCategoryId);
              }
            }}
          >
            Confirm
          </Button>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
        </Group>
      </Modal>

      {/******************Edit Modal****************/}
      <Modal
        opened={editModal}
        onClose={closeEditModal}
        title="Edit Category"
        w={524}
      >
        {data?.pagedCategory ? (
          <EditCategory
            page={page}
            category={
              data.pagedCategory.find(
                (category: CategoryInterface) =>
                  category.id === selectedCategoryId
              ) || null
            }
            closeEditModal={closeEditModal}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        ) : (
          <Text>Loading category data...</Text>
        )}
      </Modal>

      <Box>
        <Group gap={40} justify="space-between" mb={20}>
          <Group gap={2}>
            <Text size="xl">Total category: </Text>
            <Text size="xl" c="orange" fw={700}>
              {data?.total}
            </Text>
          </Group>

          <Input
            placeholder="Search"
            size="md"
            width={450}
            leftSection={<CiSearch size={25} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ProtectComponent requiredPermission={PermissionType.CREATE_CATEGORY}>
            <Button
              size="md"
              color="orange"
              onClick={() => navigate("/add-category")}
            >
              <Group gap={10}>
                <IoAddCircle size={25} />
                Add category
              </Group>
            </Button>
          </ProtectComponent>
        </Group>

        <Paper bg="white" p={20} mt={40} shadow="md" radius="md">
          {isLoading || (isSearchActive && searchQuery.isLoading) ? (
            <Center style={{ height: "80vh" }}>
              <Loader size="xl" />
            </Center>
          ) : (
            <ScrollArea type="auto">
              <Table verticalSpacing="md" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    {headers.map((header) => (
                      <Table.Th key={header}>{header}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(() => {
                    const category =
                      isSearchActive && debouncedSearchTerm.trim() !== ""
                        ? searchQuery?.data // Show search results if search is active
                        : data?.pagedCategory; // Otherwise, show paginated products
                    if (category && category.length > 0) {
                      return category.map((item: CategoryInterface) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>{item.name}</Table.Td>
                          <Table.Td>
                            <Image src={item.photo} w={60} h={60} />
                          </Table.Td>
                          <Table.Td>
                            <ProtectComponent
                              requiredPermission={
                                PermissionType.UPDATE_CATEGORY
                              }
                            >
                              <Switch
                                checked={item.status === "available"}
                                onChange={() =>
                                  handleStatusChangeRequest(
                                    item.id,
                                    item.status
                                  )
                                }
                                size="md"
                              />
                            </ProtectComponent>
                          </Table.Td>
                          <Table.Td>
                            <Group c={"orange"}>
                              <ProtectComponent
                                requiredPermission={
                                  PermissionType.UPDATE_CATEGORY
                                }
                              >
                                <FaRegEdit
                                  size={25}
                                  cursor={"pointer"}
                                  onClick={() => editModalOpen(item.id)}
                                />
                              </ProtectComponent>
                              <ProtectComponent
                                requiredPermission={
                                  PermissionType.DELETE_CATEGORY
                                }
                              >
                                <MdDelete
                                  size={25}
                                  cursor={"pointer"}
                                  onClick={() => openDeleteModal(item.id)}
                                />
                              </ProtectComponent>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ));
                    }

                    return (
                      <Table.Tr>
                        <Table.Td colSpan={headers.length}>
                          <Text>No products found</Text>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })()}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          )}
          <Pagination
            total={Math.ceil(data?.total / PAGE_SIZE)}
            onChange={(e) => setPage(e)}
            mt={20}
          />
        </Paper>

        {/* Confirm Modal */}
        <ConfirmModal
          opened={modalOpened}
          onClose={() => {
            if (!isConfirming) {
              setModalOpened(false);
            }
          }}
          onConfirm={confirmStatusChange}
          title={`Are you sure you want to change the status to ${
            selectedCategory?.status === "available"
              ? "available"
              : "unavailable"
          }?`}
          loading={isConfirming}
        />
      </Box>
    </>
  );
}
