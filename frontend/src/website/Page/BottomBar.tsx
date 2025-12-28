import {
  Box,
  Checkbox,
  Flex,
  Group,
  Image,
  Input,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  FaFacebook,
  FaInstagramSquare,
  FaTiktok,
  FaYoutube,
  FaLinkedin,
  FaArrowRight,
} from "react-icons/fa";

const BottomBar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Paper bg="#EFF0F6">
      <Group
        justify={isMobile ? "center" : "space-between"}
        style={{
          padding: isMobile ? "20px 20px" : "30px 100px",
          flexDirection: isMobile ? "column" : "row",
        }}
        mt={100}
      >
        <Image src="img/scanlogo.png" w={isMobile ? 150 : 200} h={50} />
        <Group gap={isMobile ? 12 : 16} mt={isMobile ? 20 : 0}>
          <FaFacebook size={24} />
          <FaInstagramSquare size={24} />
          <FaTiktok size={24} />
          <FaYoutube size={24} />
          <FaLinkedin size={24} />
        </Group>
      </Group>

      <Flex
        style={{
          padding: isMobile ? "20px 20px" : "30px 100px",
          flexDirection: isMobile ? "column" : "row",
        }}
        justify="space-between"
        gap={isMobile ? 20 : 50}
      >
        <Box style={{ width: isMobile ? "100%" : "auto" }}>
          <Input
            size="lg"
            radius={20}
            rightSection={<FaArrowRight color="#EC5B00" />}
            placeholder="Enter your email"
            w={isMobile ? "100%" : 300}
          />
          <Flex mt={20} align="flex-start" gap={10}>
            <Checkbox style={{ marginTop: 3 }} />
            <Text c="#4E4B66" size={isMobile ? "sm" : "md"}>
              I consent to being contacted by email. Your email address is safe
              with us. Read our{" "}
              <span style={{ borderBottom: "1px solid black" }}>
                Privacy Policy
              </span>
            </Text>
          </Flex>
        </Box>

        {/* In mobile view, show Company and Contact Us side by side */}
        {isMobile ? (
          <Flex gap={50}>
            <Stack style={{ flex: 1 }}>
              <Text
                c="#EC5B00"
                size="16px"
                lh="100%"
                fw={600}
                lts={-1}
              >
                Company
              </Text>
              <Text
                mt={10}
                size="14px"
                lh="22px"
                lts="0.25px"
                fw={500}
                c="#6E7191"
              >
                About Us
              </Text>
              <Text size="14px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Privacy & Policy
              </Text>
              <Text size="14px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Terms of Service
              </Text>
              <Text size="14px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Documentation
              </Text>
            </Stack>
            
            <Stack style={{ flex: 1 }}>
              <Text
                c="#EC5B00"
                size="16px"
                lh="100%"
                fw={600}
                lts={-1}
              >
                Contact Us
              </Text>
              <Text
                mt={10}
                size="14px"
                lh="22px"
                lts="0.25px"
                fw={500}
                c="#6E7191"
              >
                Contact
              </Text>
              <Text size="14px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                FAQ's
              </Text>
              <Text size="14px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Privacy Settings
              </Text>
              <Text size="14px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Login
              </Text>
            </Stack>
          </Flex>
        ) : (
         
          <>
            <Stack gap={10} style={{ width: isMobile ? "100%" : "auto" }}>
              <Text
                c="#EC5B00"
                size="18px"
                lh="100%"
                fw={600}
                lts={-1}
              >
                Company
              </Text>
              <Text
                mt={20}
                size="16px"
                lh="22px"
                lts="0.25px"
                fw={500}
                c="#6E7191"
              >
                About Us
              </Text>
              <Text size="16px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Privacy & Policy
              </Text>
              <Text size="16px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Terms of Service
              </Text>
              <Text size="16px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Documentation
              </Text>
            </Stack>

            <Stack gap={10} style={{ width: isMobile ? "100%" : "auto" }}>
              <Text
                c="#EC5B00"
                size="18px"
                lh="100%"
                fw={600}
                lts={-1}
              >
                Contact Us
              </Text>
              <Text
                mt={20}
                size="16px"
                lh="22px"
                lts="0.25px"
                fw={500}
                c="#6E7191"
              >
                Contact
              </Text>
              <Text size="16px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                FAQ's
              </Text>
              <Text size="16px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Privacy Settings
              </Text>
              <Text size="16px" lh="22px" lts="0.25px" fw={500} c="#6E7191">
                Login
              </Text>
            </Stack>
          </>
        )}
      </Flex>
    </Paper>
  );
};

export default BottomBar;