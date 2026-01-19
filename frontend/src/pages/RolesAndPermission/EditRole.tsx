/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  Switch,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

interface Permission {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export default function EditRole() {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const isSmallScreen = useMediaQuery("(max-width: 768px)"); // Adjust breakpoint as needed

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //Fetch the selected role info
  async function fetchSelectedRole() {
    const res = await axiosPrivateInstance.get(
      `/permission/get-role-staff/${id}`
    );
    return res.data;
  }

  const { data: roleById, isLoading: isLoadingRoleById } = useQuery({
    queryKey: ["roleById"],
    queryFn: fetchSelectedRole,
  });

  const form = useForm({
    initialValues: {
      roleName: "",
    },
    validate: {
      roleName: (value) =>
        value.trim().length > 0 ? null : "Role name is required",
    },
  });

  useEffect(() => {
    if (roleById) {
      form.setValues({
        roleName: roleById.name || "",
      });
    }
    const permissionIds = roleById?.permission?.map((perm) => perm.id);
    setSelectedPermissions(permissionIds);
  }, [roleById]);

  //Fetch the permission
  async function fetchData() {
    const res = await axiosPrivateInstance.get("/permission");
    return res.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["permission"],
    queryFn: fetchData,
  });

  //Patch data
  async function patchPermission() {
    await axiosPrivateInstance.patch(`/permission/update-role-staff/${id}`, {
      name: form.getValues().roleName,
      permissionIds: selectedPermissions,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: patchPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully");
      form.reset();
      setSelectedPermissions([]);
      navigate("/role-permission");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    mutate();
  };
  const handleSwitchChange = (permissionId: string) => {
    setSelectedPermissions((prevState) => {
      const newPermissions = new Set(prevState);
      if (newPermissions.has(permissionId)) {
        newPermissions.delete(permissionId);
      } else {
        newPermissions.add(permissionId);
      }
      return [...newPermissions];
    });
  };
  //Loading State
  if (isLoading || isLoadingRoleById) {
    return (
      <Paper p={25}>
        <Center>
          <Loader />
        </Center>
      </Paper>
    );
  }
  return (
    <Paper p={25}>
      <Box px={isSmallScreen ? 0 : 60} py={20}>
        <Text size="xl" mb={20} fw={700}>
          Roles
        </Text>
        <Divider size={"sm"} mb={20} />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction={"column"} gap={20}>
            <TextInput
              label="Role Name"
              placeholder="Enter the role name"
              {...form.getInputProps("roleName")}
              key={form.key("roleName")}
              size="md"
            />
            <Box mt={20}>
              <Text size="lg" mb={20} fw={700}>
                All Permissions
              </Text>
              <Paper withBorder={true} p={15} radius={"md"} shadow="sm" mt={8}>
                <Table verticalSpacing="md" highlightOnHover>
                  <Table.Thead>
                    <Table.Th>Permission</Table.Th>
                    <Table.Th>Roles</Table.Th>
                  </Table.Thead>
                  <Table.Tbody>
                    {data?.map((permission: Permission) => (
                      <Table.Tr>
                        <Table.Td>
                          <Text>{permission.name}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Switch
                            size="md"
                            checked={selectedPermissions?.includes(
                              permission.id
                            )}
                            onChange={() => handleSwitchChange(permission.id)}
                          />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Paper>
            </Box>

            <Group justify="flex-end">
              <Button
                type="submit"
                bg={"orange"}
                size="md"
                loading={isPending}
                fullWidth={isSmallScreen}
              >
                Update
              </Button>
            </Group>
          </Flex>
        </form>
      </Box>
    </Paper>
  );
}
