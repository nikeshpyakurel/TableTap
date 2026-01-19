import {
  Button,
  Flex,
  Group,
  Image,
  List,
  Paper,
  Text,
  Title,
  Card,
  Badge,
  Divider,
  Box,
  Center,
  ThemeIcon,
} from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";
import { MdReceipt, MdShoppingCart } from "react-icons/md";

const ViewReceptionOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const data = location.state;
  // const tableId = data?.session?.table?.id;

  return (
    <Paper p="lg" radius="md" shadow="sm" mih="100vh">
      <Group justify="space-between" align="center" mb="xl">
        <Group align="center">
          <ThemeIcon variant="light" color="orange" size="xl" radius="md">
            <MdReceipt size={24} />
          </ThemeIcon>
          <Title order={2} c="#ff6347">
            Order Details
          </Title>
        </Group>

        <ProtectComponent
          requiredPermission={PermissionType.CREATE_RECEPTIONORDER}
        >
          <Button
            bg="#ff6347"
            radius="md"
            size="md"
            onClick={() =>
              navigate("/reception-billing" + "/" + id, { state: data })
            }
          >
            Proceed to Billing
          </Button>
        </ProtectComponent>
      </Group>

      {data?.orderItem?.length > 0 ? (
        <Flex gap="lg" wrap="wrap">
          {data.orderItem.map((item: any) => (
            <Card
              key={item.id}
              shadow="sm"
              padding="lg"
              radius="md"
              w={300}
              withBorder
            >
              <Card.Section>
                {item?.product?.photo ? (
                  <Image
                    src={item.product.photo}
                    mah={180}
                    alt={item.product.name}
                  />
                ) : (
                  <Center bg="gray.1" h={160}>
                    <Text c="dimmed">No image available</Text>
                  </Center>
                )}
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={600} size="lg" lineClamp={1}>
                  {item.product.name}
                </Text>
                <Badge color="orange" variant="light">
                  Qty: {item.quantity}
                </Badge>
              </Group>

              <Text c="dimmed" size="sm">
                {item.product.description || "No description available"}
              </Text>

              {item?.orderAddOn?.length > 0 && (
                <>
                  <Divider my="sm" />
                  <Text fw={600} size="sm" mb="xs">
                    Add-ons
                  </Text>
                  <List size="sm" spacing="xs">
                    {item.orderAddOn.map((addon: any) => (
                      <List.Item key={addon.id}>
                        <Group gap="xs">
                          <Text>{addon.productAddOn.name}</Text>
                          <Text c="dimmed" size="xs">
                            (+Rs. {addon.productAddOn.price})
                          </Text>
                        </Group>
                      </List.Item>
                    ))}
                  </List>
                </>
              )}

              <Divider my="sm" />

              <Group justify="space-between">
                <Text fw={600}>Item Total:</Text>
                <Text fw={700} c="#ff6347">
                  Rs. {(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </Group>
            </Card>
          ))}
        </Flex>
      ) : (
        <Box ta="center" py="xl">
          <ThemeIcon variant="light" color="gray" size="xl" radius="xl" mb="md">
            <MdShoppingCart size={32} />
          </ThemeIcon>
          <Title order={4} c="dimmed" mb="sm">
            No items in this order
          </Title>
          <Text c="dimmed">This order doesn't contain any items yet.</Text>
        </Box>
      )}
    </Paper>
  );
};

export default ViewReceptionOrder;
