import { FormEvent, useState } from "react";
import {
  Button,
  Paper,
  Flex,
  Group,
  Title,
  Center,
  Text,
  Image,
  PasswordInput,
  Text as MantineText,
} from "@mantine/core";
import { axiosPublicInstance } from "../../api";
import { resetPassword } from "../../api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  const token = params.get("token");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setPasswordError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character"
      );
      return;
    }
  };
  const handlePasswordReset = async () => {
    const response = await axiosPublicInstance.patch(
      resetPassword,
      {
        newPassword: password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };
  const { mutate: resetPasswordMutation, isPending: isPendingReset } =
    useMutation({
      mutationKey: ["reset-password"],
      mutationFn: handlePasswordReset,
      onSuccess: () => {
        toast.success("Password updated successfully");
        navigate("/dashboard");
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message || err.message || "An error occurred"
        );
      },
    });

  return (
    <>
      <Flex mah="100vh" justify="space-between">
        <Center p={90}>
          <form onSubmit={handleSubmit}>
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
                  Fill up the form to update your password
                </Text>
                <PasswordInput
                  mt={20}
                  placeholder="Enter Your New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError ? true : false}
                />
                {passwordError && (
                  <MantineText color="red" size="sm" mt={5}>
                    {passwordError}
                  </MantineText>
                )}
                <PasswordInput
                  mt={20}
                  placeholder="Confirm Your New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={error ? true : false}
                />
                {error && (
                  <MantineText c="red" size="sm" mt={5}>
                    {error}
                  </MantineText>
                )}

                <Button
                  type="submit"
                  mt={20}
                  onClick={() => resetPasswordMutation()}
                  loading={isPendingReset}
                >
                  Update Password
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
