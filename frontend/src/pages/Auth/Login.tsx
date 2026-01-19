/* eslint-disable react-hooks/exhaustive-deps */
import {
  TextInput,
  Button,
  Paper,
  Title,
  PasswordInput,
  Checkbox,
  Box,
  BackgroundImage,
  Flex,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoginResponse } from "../../model/auth.model";
import { axiosPublicInstance } from "../../api";
import { useMediaQuery } from "@mantine/hooks";

export default function Login() {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token =
    window.sessionStorage.getItem("rToken") ||
    window.localStorage.getItem("rToken");
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
      toast.error("Log out first to be redirected to the login page.");
    }
  }, []);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password enter the password",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const { email, password, rememberMe } = values;
    try {
      const res = await axiosPublicInstance.post<LoginResponse>(
        "/auth/signin",
        { email, password },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const { refreshToken } = res.data;
      if (res?.status === 201) {
        if (rememberMe) {
          localStorage.setItem("rToken", refreshToken);
        } else {
          sessionStorage.setItem("rToken", refreshToken);
        }
        toast.success("Login Successful");
        navigate("/dashboard");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box mih={"100vh"}>
        <BackgroundImage
          src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Paper p={30} mih={"100vh"} maw={isSmallScreen ? "100%" : 450}>
            <Box mt={60}>
              <Title order={2} ta="center" mt="md" mb={50} c="#262338">
                TableTap Resturent Dashboard
              </Title>
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  label="Email address"
                  placeholder="hello@gmail.com"
                  size="md"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  mt="md"
                  size="md"
                  {...form.getInputProps("password")}
                />
                <Flex mt={"xl"} justify={"space-between"} align={"center"}>
                  <Checkbox
                    label="Keep me logged in"
                    size="md"
                    {...form.getInputProps("rememberMe")}
                  />
                  <Link
                    to="/forget-password"
                    style={{
                      fontSize: "14px",
                      color: "#387DD6",
                    }}
                  >
                    Forget password
                  </Link>
                </Flex>
                <Button
                  fullWidth
                  bg={"#EB5D36"}
                  mt="xl"
                  size="md"
                  loading={loading}
                  type="submit"
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  mt={"lg"}
                  c={"#EB5D36"}
                  variant="outline"
                  color="#EB5D36"
                  size="md"
                  onClick={() => {
                    navigate("/staff-login");
                  }}
                >
                  Staff login
                </Button>
              </form>
            </Box>
          </Paper>
        </BackgroundImage>
      </Box>
    </>
  );
}
