import { Button, Center, Image, Title } from "@mantine/core";

const DownloadBill = () => {
  return (
    <>
      <Title ta="center" size="h3">
        BBQ HOUSE{" "}
      </Title>
      <Image mt={20} src="img/bill.png" height={500}  fit="contain" alt="Bill" />
      <Center>
        <Button mt={20} color="#ff6347">
          Download Bill
        </Button>
      </Center>
    </>
  );
};

export default DownloadBill;
