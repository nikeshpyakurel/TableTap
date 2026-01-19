import { Box, Button, Flex, NumberInput, Paper, Text } from "@mantine/core";
import { toast } from "react-toastify";
import { useState } from "react";
import useMenuInfo from "../../context/store";

const CheckSessionPage = ({ sessionPhoneNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { setContactNumber } = useMenuInfo();
  function validatePhone() {
    if (phoneNumber.toString() === sessionPhoneNumber) {
      setContactNumber(phoneNumber);
    } else {
      toast.error("Phone number doesnot match");
    }
  }
  return (
    <Box p={20}>
      <Flex direction="column" align="center" justify="center" gap="xl">
        <Paper withBorder p={20} shadow="xl">
          <Flex direction="column" gap="xl">
            <Text ta="center" fw="bold">
              This QR code has already been scaned
            </Text>
            <Flex align="center">
              <Text ta="center">
                If you are on same table please enter the first mobile number to
                continue adding to the same menu.
              </Text>
            </Flex>
            <NumberInput
              value={phoneNumber}
              onChange={(e: any) => setPhoneNumber(e)}
              required
              bg="#F4F4F5"
              placeholder="Please enter initial mobile number"
            />
            <Button onClick={validatePhone} bg="#ff6347">
              View Menu
            </Button>
          </Flex>
        </Paper>
      </Flex>
    </Box>
  );
};

export default CheckSessionPage;
