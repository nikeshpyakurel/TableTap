import {
  TextInput,
  Button,
  Paper,
  Flex,
  Group,
  Title,
  Center,
  Text,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { axiosPrivateInstance } from "../../api";
import { forgetPassword } from "../../api/auth";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function ForgetPassword() {
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Invalid email",
    },
  });

  const handleEmailSubmit = async (email: string) => {
    const response = await axiosPrivateInstance.post(forgetPassword, {
      email,
    });
    return response.data;
  };

  const { mutate: forgetPasswordMutation, isPending: isPendingForgetPassword } =
    useMutation({
      mutationKey: ["forget-password"],
      mutationFn: async () => await handleEmailSubmit(form.values.email),
      onSuccess: () => {
        toast.success("Email sent successfully");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to send email");
      },
    });

  return (
    <>
      <Flex mah="100vh" justify="space-between">
        <Center p={90}>
          <form onSubmit={form.onSubmit(() => forgetPasswordMutation())}>
            <Paper>
              <Flex direction="column">
                <Group gap={8}>
                  <Title c="#6092FE" size="h2">
                    TableTap
                  </Title>
                </Group>
                <Title mt={30} size="h3">
                  Forget Password
                </Title>
                <Text mt={5} c="#969696">
                  Please fill up the form to reset your password
                </Text>
                <TextInput
                  mt={20}
                  placeholder="Enter Your Valid Email"
                  {...form.getInputProps("email")}
                />

                <Button
                  type="submit"
                  mt={20}
                  loading={isPendingForgetPassword}
                >
                  Continue
                </Button>
              </Flex>
            </Paper>
          </form>
        </Center>

        <Image visibleFrom="sm" src={"public/materials/img/loginpage.png"} />
      </Flex>
    </>
  );
}
