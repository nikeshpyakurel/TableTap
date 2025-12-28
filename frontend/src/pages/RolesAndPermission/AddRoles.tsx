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
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

interface Permission {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export default function AddRoles() {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const form = useForm({
    initialValues: {
      roleName: "",
    },
    validate: {
      roleName: (value) =>
        value.trim().length > 0 ? null : "Role name is required", // Error message for empty input
    },
  });

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
  //Fetch the permission
  async function fetchPermission() {
    const res = await axiosPrivateInstance.get("/permission");
    return res.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["permission"],
    queryFn: fetchPermission,
  });

  //Post data
  async function postPermission() {
    await axiosPrivateInstance.post("/permission/create-role-staff", {
      name: form.getValues().roleName,
      permissionIds: selectedPermissions,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: postPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully");
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
    <Paper p={25}>
      <Box px={isSmallScreen ? 0 : 60} py={20}>
        <Text size="xl" mb={20} fw={700}>
          Add Roles
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
            <Box>
              <Text mb={0} fw={"bold"}>
                Permission
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
              <Button type="submit" bg={"orange"} size="md" loading={isPending}>
                Save
              </Button>
            </Group>
          </Flex>
        </form>
      </Box>
    </Paper>
  );
}
