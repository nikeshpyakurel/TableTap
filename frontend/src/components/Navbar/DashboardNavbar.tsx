//Icons
import { VscDashboard } from "react-icons/vsc";
import { AiFillProduct } from "react-icons/ai";
import { BiSolidCategory } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { RiUserSettingsFill } from "react-icons/ri";
import { MdTableBar } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
// import { BiSolidOffer } from "react-icons/bi";

import { PiHamburgerFill } from "react-icons/pi";
import { FaShoppingCart } from "react-icons/fa";

import { Flex } from "@mantine/core";
import { NavLink } from "react-router-dom";
import styles from "./DashboardNavbar.module.css";
import { PermissionType } from "../../type";
import ProtectComponent from "../../route/ProtectComponent";
import useStaffAuthStore from "../../providers/useStaffAuthStore";
export default function DashboardNavbar({ toggle }: { toggle: () => void }) {
  const { permission } = useStaffAuthStore();

  const navlinkList = [
    {
      text: "Dashboard",
      path: "dashboard",
      icon: <VscDashboard size={30} />,
      permission: "",
    },
    {
      text: "Products",
      path: "products",
      icon: <AiFillProduct size={30} />,
      permission: PermissionType.VIEW_PRODUCT,
    },
    {
      text: "Category",
      path: "category",
      icon: <BiSolidCategory size={30} />,
      permission: PermissionType.VIEW_CATEGORY,
    },
    {
      text: "Orders",
      path: "orders",
      icon: <IoIosNotifications size={30} />,
      permission: permission.includes(PermissionType.VIEW_RECEPTIONORDER)
        ? PermissionType.VIEW_RECEPTIONORDER
        : PermissionType.VIEW_TABLEORDER,
    },
    {
      text: "Quick Order",
      path: "quick-food-order",
      icon: <PiHamburgerFill size={30} />,
      permission: PermissionType.VIEW_TAKEAWAYORDER,
    },
    {
      text: "Role & Permission",
      path: "role-permission",
      icon: <RiUserSettingsFill size={30} />,
      permission: PermissionType.VIEW_ROLE,
    },
    {
      text: "Admin Manage",
      path: "admin-manage",
      icon: <MdManageAccounts size={30} />,
      permission: PermissionType.VIEW_STAFF,
    },
    {
      text: "Table",
      path: "table",
      icon: <MdTableBar size={30} />,
      permission: PermissionType.VIEW_TABLE,
    },
    {
      text: "Reception Order",
      path: "table-order",
      icon: <FaShoppingCart size={27} />,
      permission: PermissionType.VIEW_RECEPTIONORDER,
    },
  ];
  return (
    <>
      <Flex direction={"column"} gap={10} style={{ overflow: "auto" }}>
        {navlinkList.map((item, index) => (
          <ProtectComponent key={index} requiredPermission={item.permission}>
            <NavLink
              to={item.path}
              className={styles.navbar}
              onClick={toggle}
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: "#FF702A" }
                  : { backgroundColor: "" }
              }
            >
              <Flex align={"center"} gap={10}>
                <div className={styles.iconContainer}>{item.icon}</div>
                <div>{item.text}</div>
              </Flex>
            </NavLink>
          </ProtectComponent>
        ))}
      </Flex>
    </>
  );
}
