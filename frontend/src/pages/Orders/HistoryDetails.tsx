import { Badge, Box, Group, Image, Paper, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosPrivateInstance } from "../../api";
import { acceptOrder } from "../../api/order";

const HistoryDetails = () => {
  const { id } = useParams();
  const { data: completedOrderData } = useQuery({
    queryKey: [`acceptOrder`],
    queryFn: async () => {
      const response = await axiosPrivateInstance.get(`${acceptOrder}/${id}`);
      return response.data;
    },
  });
  return (
    <>
      <Paper p="md" mt={10}>
        <Title size="h3" c="#ff6347">
          Order Details
        </Title>
        <Box>
          {completedOrderData?.orderItem?.map((item: any, index: any) => {
            return (
              <Paper key={index} p="md" mt={10} shadow="md">
                <Group>
                  <Image
                    src={item?.product?.photo}
                    w={100}
                    h={100}
                    radius={5}
                  />
                  <Box>
                    <Text fw={600}>{item?.product?.name}</Text>
                    <Text>Quantity: {item?.quantity}</Text>
                    <Text>Price : Rs {item?.product?.price}</Text>

                    {item.orderAddOn?.length > 0 && (
                      <Box mt={10}>
                        <Text fw={600} size="sm">
                          Add-ons:
                        </Text>
                        {item.orderAddOn.map((addOn: any, addOnIndex: any) => (
                          <Text key={addOnIndex} size="sm">
                            - {addOn?.productAddOn?.name}: Rs{" "}
                            {addOn?.productAddOn?.price}
                          </Text>
                        ))}
                      </Box>
                    )}
                    <Badge
                      color={item.status == "accepted" ? "green" : "red"}
                      mt={5}
                    >
                      {item.status}
                    </Badge>
                  </Box>
                </Group>
              </Paper>
            );
          })}
        </Box>
      </Paper>
    </>
  );
};

export default HistoryDetails;
