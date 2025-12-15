import {
  Box,
  Button,
  Center,
  Group,
  Input,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { axiosPrivateInstance } from "../../api";
import { PostLead } from "../../api/website";
import { toast } from "react-toastify";

const Hero = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

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

      <Box
        mt={isMobile ? 40 : 80}
        px={isMobile ? 20 : 100}
        pb={isMobile ? 60 : 100}
      >
        <Title
          c="#262338"
          fw={600}
          size={isMobile ? "32px" : "62px"}
          lh={1.2}
          ta="center"
          style={{ letterSpacing: "0.96px" }}
        >
          Ditch The Dining Delays.
        </Title>

        <Title
          c="#262338"
          mt={isMobile ? 16 : 25}
          size={isMobile ? "20px" : "37px"}
          lh="1.3"
          fw={600}
          ta="center"
          style={{ letterSpacing: isMobile ? "1px" : "4px" }}
        >
          Elevate Your Restaurant’s Efficiency
        </Title>

        <Center>
          <Text
            c="#4E4B66"
            mt={isMobile ? 16 : 25}
            size={isMobile ? "14px" : "16px"}
            lh="26px"
            fw={500}
            ta="center"
            maw={774}
            px={isMobile ? 10 : 0}
          >
            A smarter way to manage orders, reduce staffing strain, and keep
            guests coming back. Tailored to resonate with restaurant owners by
            addressing their core challenges and goals.
          </Text>
        </Center>

        <Center>
          <Button
            onClick={() => {
              openModal();
            }}
            mt={isMobile ? 30 : 40}
            radius={15}
            w={isMobile ? "100%" : 250}
            h="56px"
            size="md"
            bg="#EC5B00"
            rightSection={<FaArrowRight />}
          >
            Signup for Free
          </Button>
        </Center>
      </Box>
    </>
  );
};

export default Hero;
