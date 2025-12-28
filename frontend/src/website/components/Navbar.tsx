import {
  Button,
  Drawer,
  Group,
  Image,
  Input,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  Burger,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { useState } from "react";
import { axiosPrivateInstance } from "../../api";
import { PostLead } from "../../api/website";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

const Navbar = () => {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    const body = {
      name,
      email,
      contact,
      businessType,
      businessName,
    };
    const response = await axiosPrivateInstance.post(PostLead, body);
    return response.data;
  };
  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      closeModal();
      toast.success("Submitted successfully");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
        refetchType: "active",
        exact: true,
      });
    },

    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
    },
  });

  gsap.registerPlugin(ScrollToPlugin);

  const scrollToSection = (id) => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: `#${id}`, offsetY: 50 },
      ease: "power2.out",
    });
  };
  const navItems = (
    <>
      <a style={linkStyle} onClick={() => scrollToSection("features")}>
        Features
      </a>
      <a style={linkStyle} href="#contact">
        Contact Us
      </a>
      <a style={linkStyle} onClick={() => scrollToSection("how-it-works")}>
        How It Works
      </a>
    </>
  );

  const actionButtons = (
    <>
      <Button
        c="#EC5B00"
        variant="transparent"
        onClick={() => {
          navigate("/login");
          closeDrawer();
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          openModal();
          closeDrawer();
        }}
        radius={15}
        w={isMobile ? "100%" : 250}
        h="56px"
        bg="#EC5B00"
        rightSection={<FaArrowRight />}
      >
        Signup for Free
      </Button>
    </>
  );

  return (
    <>
      <Modal
        radius={20}
        opened={modalOpened}
        onClose={closeModal}
        size="lg"
        title={
          <Text fw={600} fz="lg">
            Get access to Scan Menu
          </Text>
        }
      >
        <Text size="sm" mb="md" c="dimmed">
          Provide us with your contact details and we'll get back to you.
        </Text>
        <Group grow wrap="nowrap" align="start">
          <Stack w="100%" gap="sm">
            <Text size="sm" c="#4E4B66">
              Name
            </Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
            />
            {/* hello */}
            <Text size="sm" c="#4E4B66">
              Contact
            </Text>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your contact number"
            />
            <Text size="sm" c="#4E4B66">
              Business Name
            </Text>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
            />
          </Stack>
          <Stack w="100%" gap="sm">
            <Text size="sm" c="#4E4B66">
              Email
            </Text>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
            <Text size="sm" c="#4E4B66">
              Business Type
            </Text>
            <Select
              value={businessType}
              onChange={(e) => setBusinessType(e || "")}
              placeholder="Select type"
              data={["Restaurant", "Hotel", "Cafe", "Bar"]}
            />
          </Stack>
        </Group>
        <Group justify="center" mt="xl">
          <Button variant="default" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            bg="#EC5B00"
            color="white"
            onClick={() => mutate()}
            loading={isPending}
          >
            Submit
          </Button>
        </Group>
      </Modal>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        // title="Menu"
        padding="md"
        size="80%"
        withCloseButton
      >
        <Stack gap="lg" align="center">
          {navItems}
          {actionButtons}
        </Stack>
      </Drawer>

      {/* Navbar */}
      <Paper style={{ padding: isMobile ? "20px" : "30px 100px" }}>
        <Group justify="space-between" align="center">
          <Image src="img/scanlogo.png" w={100} />

          {isMobile ? (
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          ) : (
            <Group gap={40}>
              {navItems}
              <Group>{actionButtons}</Group>
            </Group>
          )}
        </Group>
      </Paper>
    </>
  );
};

const linkStyle = {
  fontWeight: "400",
  lineHeight: "24px",
  letterSpacing: "0.75px",
  fontFamily: "Poppins",
  color: "#4E4B66",
  fontSize: "20px",
  textDecoration: "none",
  cursor: "pointer",
};

export default Navbar;
