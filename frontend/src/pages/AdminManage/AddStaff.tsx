import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { axiosPrivateInstance } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
//Icons

export default function AddStaff() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addStaffForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      newPassword: "",
      confirmPassword: "",
      staffRole: [],
    },
    validate: {
      name: (value) =>
        value.trim().length < 2 ? "Name must have at least 4 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) =>
        /^\d{10}$/.test(value) ? null : "Invalid phone number",
      address: (value) =>
        value.trim().length === 0 ? "Address is required" : null,
      newPassword: (value) => {
        if (value.length < 6)
          return "Password must be at least 6 characters long.";
        // if (!/[A-Z]/.test(value))
        //   return "Password must contain at least one uppercase letter.";
        // if (!/[a-z]/.test(value))
        //   return "Password must contain at least one lowercase letter.";
        // if (!/\d/.test(value))
        //   return "Password must contain at least one digit.";
        // if (!/[@$!%*?&]/.test(value))
        //   return "Password must contain at least one special character.";
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords doesn't match" : null,
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

  //Add Staff Mutation
  async function handelAddStaff() {
    try {
      await axiosPrivateInstance.post("/staff/create-staff", {
        name: addStaffForm.getValues().name,
        staffTypeId: addStaffForm.getValues().staffRole,
        address: addStaffForm.getValues().address,
        phone: parseInt(addStaffForm.getValues().phone),
        email: addStaffForm.getValues().email.toLowerCase(),
        password: addStaffForm.getValues().newPassword,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      throw new Error(errorMessage);
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handelAddStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff created successfully");
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
          Add Staff
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
              label="Email"
              placeholder="Email"
              key={addStaffForm.key("email")}
              {...addStaffForm.getInputProps("email")}
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

            <PasswordInput
              label="Password"
              placeholder="Password"
              key={addStaffForm.key("newPassword")}
              {...addStaffForm.getInputProps("newPassword")}
              size="md"
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm Password"
              key={addStaffForm.key("confirmPassword")}
              {...addStaffForm.getInputProps("confirmPassword")}
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
                Add Staff
              </Button>
            </Group>
          </Flex>
        </form>
      </Box>
    </Paper>
  );
}
