import { Badge, Box, Group, Image, Paper, Text, Title } from "@mantine/core";
import { useLocation } from "react-router-dom";

const QuickOrderDetails = () => {
  const location = useLocation();
  const quickOrderData = location.state;
  return (
    <Paper p={20} shadow="md" radius="md">
      <Title size="h3" c="#ff6347">
        Quick Order Details
      </Title>
      {quickOrderData?.takeAwayOrderItems?.map((item: any, index: any) => {
        return (
          <Paper key={index} p="md" shadow="md" mt={20}>
            <Group justify="space-between">
              <Group>
                {item.product.photo && (
                  <Image
                    src={item?.product?.photo}
                    w={100}
                    h={100}
                    radius={5}
                    alt={item?.product?.name}
                  />
                )}
                <Box>
                  <Text fw={600}>{item?.product?.name}</Text>
                  <Text size="sm">Quantity: {item.quantity}</Text>
                  <Text size="sm">Price: {item.product.price}</Text>
                  {item.orderAddOn?.length > 0 && (
                    <Box mt={10}>
                      <Text fw={600} size="sm">
                        Add-ons:
                      </Text>
                      {item.takeAwayOrderAddon.map(
                        (addOn: any, addOnIndex: any) => (
                          <Text key={addOnIndex} size="sm">
                            - {addOn?.productAddOn?.name}: Rs{" "}
                            {addOn?.productAddOn?.price}
                          </Text>
                        )
                      )}
                    </Box>
                  )}
                  <Badge color="green" mt={5}>
                    Accepted
                  </Badge>
                </Box>
              </Group>
            </Group>
          </Paper>
        );
      })}
    </Paper>
  );
};

export default QuickOrderDetails;
