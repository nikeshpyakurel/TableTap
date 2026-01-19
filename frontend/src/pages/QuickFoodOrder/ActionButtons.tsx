import { Button, Group } from "@mantine/core";
import { FaShoppingCart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";

export const ActionButtons = ({
  isMobile,
  cart,
  openDrawer,
  navigate,
  openClearCartModal,
  path,
}) => (
  <Group justify="space-between" w={isMobile ? "100%" : ""}>
    {isMobile && (
      <Button size="md" onClick={openDrawer}>
        <GiHamburgerMenu size={20} />
      </Button>
    )}
    <Group>
      <ProtectComponent
        requiredPermission={PermissionType.CREATE_TAKEAWAYORDER}
      >
        <Button
          size="md"
          bg="#FF702A"
          leftSection={<FaShoppingCart />}
          onClick={() => {
            if (cart.length === 0) {
              toast.error("Cart is empty");
              return;
            }
            navigate(path);
          }}
        >
          ({cart.length})
        </Button>
      </ProtectComponent>

      <ProtectComponent
        requiredPermission={PermissionType.DELETE_TAKEAWAYORDER}
      >
        <Button
          size="md"
          color="red"
          disabled={cart.length === 0}
          onClick={openClearCartModal}
        >
          <MdDelete size={20} />
        </Button>
      </ProtectComponent>
    </Group>
  </Group>
);
