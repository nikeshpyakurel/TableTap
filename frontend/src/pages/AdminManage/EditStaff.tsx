/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
//Icons

export default function EditStaff() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const addStaffForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: state.name,
      phone: state.phone,
      address: state.address,
      staffRole: "",
    },
    validate: {
      name: (value) =>
        value.trim().length < 2 ? "Name must have at least 4 letters" : null,
      phone: (value) => {
        if (!/^\d{10}$/.test(value.trim())) {
          return "Invalid phone number. Must be exactly 10 digits.";
        }
        return null;
      },
      address: (value) =>
        value.trim().length < 5
          ? "Address must be at least 5 characters long."
          : null,
      staffRole: (value) => (!value ? "Staff role is required" : null),
    },
  });

  //Fetch Staff Role
  async function fetchStaffRole() {
    const res = await axiosPrivateInstance.get("/permission/get-role-staff");
    return res.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["staff-role"],
    queryFn: fetchStaffRole,
  });

  const roleData = data?.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  useEffect(() => {
    if (data) {
      addStaffForm.setFieldValue("staffRole", state.staffType.id);
    }
  }, [data]);

  //Add Staff Mutation
  async function handelUpdateStaff() {
    try {
      await axiosPrivateInstance.patch(`/staff/update-staff-info/${state.id}`, {
        name: addStaffForm.getValues().name,
        address: addStaffForm.getValues().address,
        phone: parseInt(addStaffForm.getValues().phone),
        staffType: addStaffForm.getValues().staffRole,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handelUpdateStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff updated successfully");
      addStaffForm.reset();
      navigate("/admin-manage");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleSubmit() {
    mutate();
  }
  return (
    <Paper p={25}>
      <Box pl={60} pr={60} pt={20} pb={20}>
        <Text size="xl" mb={20} fw={700}>
          Edit Staff
        </Text>
        <Divider size={"sm"} mb={20} />
        <form onSubmit={addStaffForm.onSubmit(handleSubmit)}>
          <Flex direction={"column"} gap={20}>
            <TextInput
              label="Name"
              placeholder="Name"
              key={addStaffForm.key("name")}
              {...addStaffForm.getInputProps("name")}
              size="md"
            />

            <TextInput
              label="Phone"
              placeholder="Phone"
              key={addStaffForm.key("phone")}
              {...addStaffForm.getInputProps("phone")}
              size="md"
            />

            <TextInput
              label="Address"
              placeholder="Address"
              key={addStaffForm.key("address")}
              {...addStaffForm.getInputProps("address")}
              size="md"
            />

            <Select
              label="Staff Role"
              disabled={isLoading}
              placeholder={
                isLoading ? "Loading Staff Roles" : "Select staff role"
              }
              data={roleData}
              key={addStaffForm.key("staffRole")}
              {...addStaffForm.getInputProps("staffRole")}
              size="md"
            />

            <Group justify="flex-end">
              <Button type="submit" bg={"orange"} size="md" loading={isPending}>
                Update Staff
              </Button>
            </Group>
          </Flex>
        </form>
      </Box>
    </Paper>
  );
}
