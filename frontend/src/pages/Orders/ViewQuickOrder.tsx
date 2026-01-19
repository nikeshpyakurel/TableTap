import {
  Button,
  Flex,
  Group,
  Image,
  List,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useLocation } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { settleBill } from "../../api/order";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ViewQuickOrder = () => {
  const location = useLocation();
  const data = location.state;

  const SettleBilling = async () => {
    const response = await axiosPrivateInstance.post(
      `${settleBill}/${data?.id}`
    );
    return response;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: SettleBilling,
    onSuccess: () => {
      toast.success("Billing settle successfully");
    },
    onError: () => {
      toast.error("Failed to accept order");
    },
  });

  return (
    <>
      <Paper p="md" mt={10}>
        <Title size="h3" c="#ff6347">
          Quick Order
        </Title>
        <Group justify="space-between">
          <Text c="#ff6347" fw={600} mt={20} ta="center">
            Order List
          </Text>
          <Button variant="default" loading={isPending} onClick={() => mutate}>
            Settle Bill
          </Button>
        </Group>

        <Flex mt={20} gap={10}>
          {data?.takeAwayOrderItems?.map((item: any, index: any) => (
            <Paper key={index} p="md" shadow="md" mt={20} w={200}>
              <Image src={item.product.photo || "/img/images.png"} radius={5} />
              <Text fw={600} mt={10}>
                {item.product.name}
              </Text>
              <Text>
                {" "}
                <strong> Quantity:</strong>
                {item.quantity}
              </Text>
              <Text fw={600}>Add On</Text>
              <List title="Additional Options" withPadding={false}>
                {item.takeAwayOrderAddOn.map((addon) => (
                  <List.Item key={addon.id}>
                    {addon.productAddOn.name} - Rs. {addon.productAddOn.price}
                  </List.Item>
                ))}
              </List>
              <Text c="#ff6347" fw={600} mt={20}>
                <strong>Price: Rs </strong>
                {item.product.price}
              </Text>
            </Paper>
          ))}
        </Flex>
      </Paper>
    </>
  );
};

export default ViewQuickOrder;
