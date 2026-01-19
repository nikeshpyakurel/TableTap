import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Table,
  Text,
} from "@mantine/core";
//Icons
import { IoAddCircle } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertComponent from "../../components/utils/Error/AlertComponent";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";
import { useState } from "react";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";
const headers = ["Name", "Email", "Phone", "Role", "Action"];
export default function AdminManage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [deleteModal, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure();

  //Handel Staff Delete
  async function handelStaffDelete(id: string) {
    try {
      await axiosPrivateInstance.delete(`/staff/${id}`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handelStaffDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff Deleted");
      closeDeleteModal();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handelDelete(id: string) {
    setSelectedId(id);
    openDeleteModal();
  }
  //Fetch Staff
  async function fetchStaff() {
    const res = await axiosPrivateInstance.get("/staff");
    return res.data;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });

  if (isLoading) {
    return (
      <Paper p={25}>
        <Center>
          <Loader size={"md"} />
        </Center>
      </Paper>
    );
  }

  if (isError) {
    return (
      <AlertComponent title="Something went wrong" message={error.message} />
    );
  }

  return (
    <>
      <Modal
        opened={deleteModal}
        onClose={closeDeleteModal}
        title="Confirm Action"
      >
        <Text>Do you want to delete the staff ?</Text>
        <Group mt={"md"}>
          <Button
            color="red"
            loading={isPending}
            onClick={() => {
              if (selectedId) {
                mutate(selectedId);
              }
            }}
          >
            Confirm
          </Button>
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
        </Group>
      </Modal>
      <Box>
        <Group gap={40} justify="space-between">
          <Group gap={2}>
            <Text size="xl">Total Staffs:</Text>
            <Text size="xl" c={"orange"} fw={700} ml={8} fz={22}>
              {data?.length}
            </Text>
          </Group>

          <ProtectComponent requiredPermission={PermissionType.CREATE_STAFF}>
            <Button
              size="md"
              bg={"orange"}
              onClick={() => navigate("/add-staff-info")}
            >
              <Group gap={10}>
                <IoAddCircle size={25} />
                Add Staff
              </Group>
            </Button>
          </ProtectComponent>
        </Group>

        <Paper bg={"white"} p={20} mt={40} shadow="md" radius={"md"}>
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {headers.map((header) => (
                  <Table.Th key={header}>{header}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data?.length > 0 ? (
                <>
                  {data?.map((staff) => (
                    <Table.Tr key={staff?.id}>
                      <Table.Td>{staff?.name}</Table.Td>
                      <Table.Td>{staff?.email}</Table.Td>
                      <Table.Td>{staff?.phone}</Table.Td>
                      <Table.Td>{staff?.staffType?.name}</Table.Td>
                      <Table.Td>
                        <Group c={"orange"}>
                          <ProtectComponent
                            requiredPermission={PermissionType.UPDATE_STAFF}
                          >
                            <FaRegEdit
                              size={23}
                              cursor={"pointer"}
                              onClick={() =>
                                navigate("/edit-staff", { state: staff })
                              }
                            />
                          </ProtectComponent>
                          <ProtectComponent
                            requiredPermission={PermissionType.DELETE_STAFF}
                          >
                            <MdDelete
                              size={23}
                              color="red"
                              cursor={"pointer"}
                              onClick={() => handelDelete(staff.id)}
                            />
                          </ProtectComponent>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              ) : (
                <>
                  <Text mt={16} ml={8}>
                    No Staff Found
                  </Text>
                </>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Box>
    </>
  );
}
