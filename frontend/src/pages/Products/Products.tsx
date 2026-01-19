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
  UnstyledButton,
} from "@mantine/core";
import { Pagination } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { toast } from "react-toastify";

//Icons
import { IoAddCircle } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { Md18UpRating, MdDelete, MdOutline18UpRating } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { LuPackagePlus } from "react-icons/lu";
import { IoHeart } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertComponent from "../../components/utils/Error/AlertComponent";
import { useDisclosure } from "@mantine/hooks";
import EditProduct from "./EditProduct";
import EditAddOn from "./EditAddOn";
import useAuthStore from "../../providers/useAuthStore";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";

interface Category {
  id: string;
  name: string;
}
export interface ProductAddon {
  createdAt: string;
  id: string;
  name: string;
  price: number;
  updatedAt: string;
}

export interface Product {
  id: string;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  isVeg: boolean;
  photo: string;
  productAddons: ProductAddon[];
  status: "available" | "unavailable";
  special: boolean;
  isAgeRestricted: boolean;
}

const PAGE_SIZE = 10;

export default function Products() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { restaurantId } = useAuthStore();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productStatus, setProductStatus] = useState<string>("");
  const [liked, setLiked] = useState(false);

  const [statusModal, { open: statusModalOpen, close: statusModalClose }] =
    useDisclosure();
  const [specialModal, { open: specialModalOpen, close: specialModalClosed }] =
    useDisclosure();
  const [deleteModal, { open: deleteModalOpen, close: deleteModalClose }] =
    useDisclosure();
  const [editModal, { open: editModalOpen, close: editModalClose }] =
    useDisclosure();
  const [addOnModal, { open: addOnModalOpen, close: addOnModalClose }] =
    useDisclosure();
  const navigate = useNavigate();
  const headers = [
    "Product",
    "Image",
    "Price",
    "Type",
    "Status",
    "Action",
    "Special",
    "Restriction",
  ];
  //Product Search
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 500);
  const [isSearchActive, setIsSearchActive] = useState(false);

  //Handel status of the product
  const openStatusChangeModal = (id: string, status: string) => {
    statusModalOpen();
    setSelectedProductId(id);
    setProductStatus(status);
  };

  const handelProductStatusChange = async (id: string) => {
    const newStatus =
      productStatus === "available" ? "unavailable" : "available";
    try {
      await axiosPrivateInstance.patch(`/product/${id}`, {
        status: newStatus,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  };

  const statusMutation = useMutation({
    mutationFn: handelProductStatusChange,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`productof${debouncedSearchTerm}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`productof${page}`],
      });
      toast.success("Product Status Changed");
      statusModalClose();
    },
    onError: (error) => toast.error(error.message),
  });

  //Handle the special toggle

  const openSpecialToggleModal = (id: string, status: boolean) => {
    specialModalOpen();
    setSelectedProductId(id);
    setLiked(status);
  };

  const handleSpecialItemToggle = async (id: string) => {
    const newStatus = liked ? false : true;
    await axiosPrivateInstance.patch(`/product/${id}`, {
      special: newStatus,
    });
  };

  const specialMutation = useMutation({
    mutationFn: handleSpecialItemToggle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`productof${debouncedSearchTerm}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`productof${page}`],
      });
      toast.success("Special attribute Changed");
      specialModalClosed();
    },
    onError: (error) => toast.error(error.message),
  });

  //Handel delition of the product
  const openDeleteModal = (id: string) => {
    deleteModalOpen();
    setSelectedProductId(id);
  };

  const handelProductDelete = async (id: string) => {
    await axiosPrivateInstance.delete(`/product/${id}`);
  };

  const deleteMutation = useMutation({
    mutationFn: handelProductDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`productof${debouncedSearchTerm}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`productof${page}`],
      });
      toast.success("Product deleted successfully");
      deleteModalClose();
    },
    onError: (error) => toast.error(error.message),
  });

  //Handel edit of the product
  const openEditModal = (id: string) => {
    setSelectedProductId(id);
    editModalOpen();
  };

  //Handel edit of adons
  const openAddOnModal = (id: string) => {
    setSelectedProductId(id);
    addOnModalOpen();
  };

  // Search product
  const handelProductSearch = async () => {
    if (debouncedSearchTerm) {
      const res = await axiosPrivateInstance.get(
        `/product/filter/${restaurantId}`,
        {
          params: {
            name: debouncedSearchTerm.trim(),
          },
        }
      );
      return res.data;
    }
    return [];
  };

  const searchQuery = useQuery({
    queryKey: [`productof${debouncedSearchTerm}`],
    queryFn: handelProductSearch,
    enabled: isSearchActive && debouncedSearchTerm.trim() !== "",
  });

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false); // Reset search when input is cleared
    }
  }, [debouncedSearchTerm]);

  //Fetch the product
  const fetchProduct = async () => {
    const res = await axiosPrivateInstance.get("/product/getAll", {
      params: { page, pageSize: PAGE_SIZE },
    });
    return res.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`productof${page}`],
    queryFn: fetchProduct,
    enabled: !isSearchActive,
  });

  if (isError) {
    return <AlertComponent title="Error Occurred" message={error.message} />;
  }

  return (
    <>
      {/* Status change confirm modal */}
      <Modal
        opened={statusModal}
        onClose={statusModalClose}
        title="Confirm Action"
      >
        <Text>Do you want to change the status ?</Text>
        <Group mt={"md"}>
          <Button
            color="red"
            loading={statusMutation.isPending}
            onClick={() => {
              if (selectedProductId) {
                statusMutation.mutate(selectedProductId);
              }
            }}
          >
            Confirm
          </Button>
          <Button variant="outline" onClick={statusModalClose}>
            Cancel
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={specialModal}
        onClose={specialModalClosed}
        title="Confirm Action"
      >
        <Text>Do you want to toggle the special attribute ?</Text>
        <Group mt={"md"}>
          <Button
            loading={specialMutation.isPending}
            onClick={() => {
              if (selectedProductId) {
                specialMutation.mutate(selectedProductId);
              }
            }}
          >
            Confirm
          </Button>
          <Button variant="outline" onClick={specialModalClosed}>
            Cancel
          </Button>
        </Group>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        opened={deleteModal}
        onClose={deleteModalClose}
        title="Do you want to delete the product?"
      >
        <Text>This action can't be undone!</Text>
        <Group mt={"md"}>
          <Button
            color="red"
            loading={deleteMutation?.isPending}
            onClick={() => {
              if (selectedProductId) {
                deleteMutation.mutate(selectedProductId);
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

      {/* edit modal */}
      <Modal opened={editModal} onClose={editModalClose} title="Edit Product">
        {data && data.pagedProducts && data.pagedProducts.length > 0 ? (
          <EditProduct
            closeEditModal={editModalClose}
            product={
              data.pagedProducts?.find(
                (product: Product) => product?.id === selectedProductId
              ) || null
            }
            page={page}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        ) : (
          <Text>Loading category data...</Text>
        )}
      </Modal>

      {/* Addons modal */}
      <Modal opened={addOnModal} onClose={addOnModalClose} title="Edit AddOns">
        {data ? (
          <EditAddOn
            product={
              data.pagedProducts?.find(
                (product: Product) => product.id === selectedProductId
              ) || null
            }
          />
        ) : (
          <Text>Loading category data...</Text>
        )}
      </Modal>

      <Box>
        <Group gap={40} justify="space-between">
          <Group gap={2}>
            <Text size="xl">Total Products: </Text>
            <Text size="xl" c={"orange"} fw={700}>
              {data?.total}
            </Text>
          </Group>

          <Box>
            <Input
              placeholder="Search"
              size="md"
              w={450}
              leftSection={<CiSearch size={25} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <ProtectComponent requiredPermission={PermissionType.CREATE_PRODUCT}>
            <Button
              size="md"
              bg={"orange"}
              onClick={() => navigate("/add-products")}
            >
              <Group gap={10}>
                <IoAddCircle size={25} />
                Add Products
              </Group>
            </Button>
          </ProtectComponent>
        </Group>

        <Paper bg={"white"} p={20} mt={40} shadow="md" radius={"md"}>
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
                    const products =
                      isSearchActive && debouncedSearchTerm.trim() !== ""
                        ? searchQuery?.data // Show search results if search is active
                        : data?.pagedProducts; // Otherwise, show paginated products
                    if (products && products.length > 0) {
                      return products.map((item: Product) => (
                        <Table.Tr key={item?.id}>
                          <Table.Td>{item?.name}</Table.Td>
                          <Table.Td>
                            <Image src={item?.photo} w={60} h={60} />
                          </Table.Td>
                          <Table.Td>{item?.price}</Table.Td>
                          <Table.Td>{item?.isVeg ? "Veg" : "Non-Veg"}</Table.Td>
                          <Table.Td>
                            <ProtectComponent
                              requiredPermission={PermissionType.UPDATE_PRODUCT}
                            >
                              <Switch
                                checked={item.status === "available"}
                                onChange={() =>
                                  openStatusChangeModal(item.id, item.status)
                                }
                                size="md"
                              />
                            </ProtectComponent>
                          </Table.Td>
                          <Table.Td>
                            <Group c={"orange"}>
                              <ProtectComponent
                                requiredPermission={
                                  PermissionType.UPDATE_PRODUCT
                                }
                              >
                                <FaRegEdit
                                  onClick={() => openEditModal(item.id)}
                                  size={25}
                                  cursor={"pointer"}
                                />
                              </ProtectComponent>
                              <ProtectComponent
                                requiredPermission={
                                  PermissionType.DELETE_PRODUCT
                                }
                              >
                                <MdDelete
                                  onClick={() => openDeleteModal(item.id)}
                                  size={25}
                                  cursor={"pointer"}
                                />
                              </ProtectComponent>
                              <ProtectComponent
                                requiredPermission={
                                  PermissionType.UPDATE_PRODUCT
                                }
                              >
                                <LuPackagePlus
                                  size={25}
                                  cursor={"pointer"}
                                  onClick={() => openAddOnModal(item.id)}
                                />
                              </ProtectComponent>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <UnstyledButton
                              onClick={() =>
                                openSpecialToggleModal(item.id, item.special)
                              }
                            >
                              {item.special ? (
                                <IoHeart size={25} color="red" />
                              ) : (
                                <IoHeartOutline size={25} color="gray" />
                              )}
                            </UnstyledButton>
                          </Table.Td>
                          <Table.Td c={"orange"}>
                            {item.isAgeRestricted ? (
                              <Md18UpRating size={30} />
                            ) : (
                              <MdOutline18UpRating color="#a5a5a5" size={30} />
                            )}
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
      </Box>
    </>
  );
}
