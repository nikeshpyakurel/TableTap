import { Box, Flex, Image, Paper, Text, Title } from "@mantine/core";
import { useRef } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    step: "Step 1",
    title: "Request and Set Up the App",
    description:
      "Submit a request to get the Scan Menu app. After approval, log in and complete your restaurant profile.",
  },
  {
    step: "Step 2",
    title: "Add Your Menu Items",
    description:
      "Create and organize your food and drink items with names, descriptions, prices, and photos.",
  },
  {
    step: "Step 3",
    title: "Generate and Place QR Codes",
    description:
      "Generate unique table-specific QR codes from the app and place them on each table.",
  },
  {
    step: "Step 4",
    title: "Let Customers Scan and Order",
    description:
      "Customers scan the QR code at their table to view your menu and place their orders directly.",
  },
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1199px)");

  // Always define scrollYProgress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Always define transforms for animation
  const stepTransforms = steps.map((_, index) => {
    const scrollStart = index / (steps.length + 1);
    const scrollEnd = (index + 1) / (steps.length + 1);

    const opacity = useTransform(
      scrollYProgress,
      [scrollStart, scrollEnd],
      [0, 1]
    );
    const translateY = useTransform(
      scrollYProgress,
      [scrollStart, scrollEnd],
      [50, 0]
    );

    return { opacity, translateY };
  });

  // Mobile layout
  if (isMobile) {
    return (
      <Paper p={20} mt={50}>
        <Box>
          <Title ta="center" size={16} fw={400} c="#181D27">
            How It Works
          </Title>
          <Title ta="center" size={24} fw={600} c="#262338" mt={10}>
            Simple Setup, Powerful Results
          </Title>
        </Box>

        <Box
          mt={30}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src="img/work.jpg"
            radius="md"
            h={200}
            w="100%"
            fit="cover"
            alt="How it works visual"
            mb={30}
            style={{ maxWidth: "400px" }}
          />

          <Flex
            direction="column"
            gap={20}
            style={{ width: "100%", maxWidth: "450px" }}
          >
            {steps.map((step, index) => (
              <Box
                key={index}
                p={20}
                style={{
                  borderRadius: 20,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                }}
              >
                <Text size="20px" fw={500} c="#535862">
                  {step.step}
                </Text>
                <Text fw={600} size="16px" c="#181D27" mt={5}>
                  {step.title}
                </Text>
                <Text size="13px" c="#4E4B66" mt={10}>
                  {step.description}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Paper>
    );
  }

  // Tablet layout - simplified version with centered content
  if (isTablet) {
    return (
      <Paper p={{ base: 30, md: 50 }} mt={50}>
        <Box mb={40}>
          <Title ta="center" size={18} fw={400} c="#181D27">
            How It Works
          </Title>
          <Title ta="center" size={32} fw={600} c="#262338" mt={10}>
            Simple Setup, Powerful Results
          </Title>
        </Box>

        <Flex direction="column" align="center" gap={40}>
          <Image
            src="img/work.jpg"
            radius="md"
            h={300}
            fit="cover"
            alt="How it works visual"
            style={{
              width: "100%",
              maxWidth: "600px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          />

          <Box style={{ width: "100%", maxWidth: "600px" }}>
            <Flex direction="column" gap={20} align="center">
              {steps.map((step, index) => (
                <Box
                  key={index}
                  p={20}
                  style={{
                    borderRadius: 16,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    width: "100%",
                  }}
                >
                  <Text size="18px" fw={500} c="#535862">
                    {step.step}
                  </Text>
                  <Text fw={600} size="16px" c="#181D27" mt={5}>
                    {step.title}
                  </Text>
                  <Text size="14px" c="#4E4B66" mt={8}>
                    {step.description}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Paper>
    );
  }

  // Desktop layout with scroll animations and centered content
  return (
    <Paper
      py={100}
      px="lg"
      mt={50}
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      <Box
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backgroundColor: "#fff",
          padding: "30px 0 10px",
        }}
      >
        <Title ta="center" size={20} fw={400} c="#181D27">
          How It Works
        </Title>
        <Title ta="center" size={37} fw={600} c="#262338" mt={10}>
          Simple Setup, Powerful Results
        </Title>
      </Box>

      <Box
        ref={containerRef}
        style={{
          height: `${steps.length * 120 + 100}vh`,
          position: "relative",
        }}
      >
        <Flex
          justify="center"
          align="center"
          style={{
            position: "sticky",
            top: 150,
            height: "80vh",
            maxWidth: 1100,
            margin: "0 auto",
            gap: 40,
          }}
        >
          {/* Left: Image */}
          <Box
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="img/work.jpg"
              radius="md"
              h={450}
              fit="cover"
              alt="How it works visual"
              style={{
                width: "100%",
                maxWidth: 500,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            />
          </Box>

          {/* Right: Steps */}
          <Box
            style={{
              flex: 1,
              position: "relative",
              height: "100%",
              maxWidth: 500,
            }}
          >
            {steps.map((step, index) => {
              const { opacity, translateY } = stepTransforms[index];
              return (
                <motion.div
                  key={index}
                  style={{
                    position: "absolute",
                    top: `${index * 120}px`,
                    width: "100%",
                    opacity,
                    y: translateY,
                  }}
                >
                  <Box
                    p={20}
                    style={{
                      borderRadius: 16,
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      width: "100%",
                    }}
                  >
                    <Text size="16px" fw={500} c="#535862">
                      {step.step}
                    </Text>
                    <Text fw={600} size="15px" c="#181D27" mt={4}>
                      {step.title}
                    </Text>
                    <Text size="12px" c="#4E4B66" mt={6}>
                      {step.description}
                    </Text>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </Flex>
      </Box>
    </Paper>
  );
};

export default HowItWorks;
