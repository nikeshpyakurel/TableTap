import { Card, Grid, Group, Image, Text } from "@mantine/core";
import { IoMdAddCircle } from "react-icons/io";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";

export const ProductCard = ({ product, span, isInCart, addToCartModal }) => (
  <Grid.Col span={span}>
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={product.photo} mah={160} alt={product.name} />
      </Card.Section>
      <Text mt={10}>{product.name}</Text>
      <Group mt={10} align="center" justify="space-between" c="#ff6347">
        <Text fw="bold" fz={18}>
          Rs {product.price}
        </Text>
        {isInCart ? (
          <Text c="red">In Cart</Text>
        ) : (
          <ProtectComponent
            requiredPermission={PermissionType.CREATE_TAKEAWAYORDER}
          >
            <IoMdAddCircle
              size={25}
              cursor="pointer"
              onClick={() => addToCartModal(product)}
            />
          </ProtectComponent>
        )}
      </Group>
    </Card>
  </Grid.Col>
);
