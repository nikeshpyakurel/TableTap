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
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";
const headers = ["Role Name", "Action"];
export default function RolesAndPermission() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [deleteModal, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  async function fetchPermission() {
    const res = await axiosPrivateInstance.get("/permission/get-role-staff");
    return res.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchPermission,
  });

  /**********Role Delete *************/
  async function handleRoleDelete(id: string) {
    await axiosPrivateInstance.delete(`/permission/delete-role-staff/${id}`);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleRoleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`roles`] });
      toast.success("Role Deleted");
      closeDeleteModal();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handelDelete(roleId: string) {
    openDeleteModal();
    setSelectedRoleId(roleId);
  }

  //Loading State
  if (isLoading) {
    return (
      <Paper p={25}>
        <Center>
          <Loader />
        </Center>
      </Paper>
    );
  }

  return (
    <>
      <Modal
        opened={deleteModal}
        onClose={closeDeleteModal}
        title="Confirm Action"
      >
        <Text>Do you want to delete the category?</Text>
        <Group mt={"md"}>
          <Button
            color="red"
            loading={isPending}
            onClick={() => {
              if (selectedRoleId) {
                mutate(selectedRoleId);
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
            <Text size="xl">Total Roles:</Text>
            <Text size="xl" c={"orange"} fw={700} ml={8}>
              {data?.length}
            </Text>
          </Group>

          <ProtectComponent requiredPermission={PermissionType.CREATE_ROLE}>
            <Button
              size="md"
              bg={"orange"}
              onClick={() => navigate("/add-roles")}
            >
              <Group gap={10}>
                <IoAddCircle size={25} />
                Add Roles
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
              {data?.map((role) => (
                <Table.Tr key={role.id}>
                  <Table.Td>{role.name}</Table.Td>
                  <Table.Td>
                    <Group c={"orange"}>
                      <ProtectComponent
                        requiredPermission={PermissionType.UPDATE_ROLE}
                      >
                        <FaRegEdit
                          size={22}
                          cursor={"pointer"}
                          onClick={() => {
                            navigate(`/edit-roles/${role.id}`);
                          }}
                        />
                      </ProtectComponent>
                      <ProtectComponent
                        requiredPermission={PermissionType.DELETE_ROLE}
                      >
                        <MdDelete
                          size={22}
                          cursor={"pointer"}
                          color="red"
                          onClick={() => handelDelete(role.id)}
                        />
                      </ProtectComponent>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Box>
    </>
  );
}
