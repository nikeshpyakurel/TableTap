import { Outlet, RouteObject } from "react-router-dom";
import MenuPage from "../pages/Restaurants/menu/MenuPage";
import MenuDetails from "../pages/Restaurants/menu-details/MenuDetails";
import Cart from "../pages/Restaurants/cart/Cart";
import ItemDetails from "../pages/Restaurants/item-details/ItemDetails";
// import OrderNumber from "../pages/Restaurants/OrderNumber";
import OrderSuccess from "../pages/Restaurants/order-success/OrderSuccess";
import Orders from "../pages/Restaurants/orders/Orders";
import OrderDetails from "../pages/Restaurants/order-details/OrderDetails";
import { CartProvider } from "../context/CartContext";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import ClientLayout from "../layout/ClientLayout";
import StaffLogin from "../pages/Auth/StaffLogin";
import Unauthorized from "../errors/Unauthorized";
import App from "../website/App";

const OpenRoutes: RouteObject = {
  path: "/",
  element: <Outlet />,
  children: [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        {
          path: "/menu",
          element: (
            <CartProvider>
              <MenuPage />
            </CartProvider>
          ),
        },
        {
          path: "/details",
          element: (
            <CartProvider>
              <MenuDetails />
            </CartProvider>
          ),
        },
        {
          path: "/cart",
          element: (
            <CartProvider>
              <Cart />
            </CartProvider>
          ),
        },
        {
          path: "/item-details/:productId",
          element: (
            <CartProvider>
              <ItemDetails />
            </CartProvider>
          ),
        },
        {
          path: "/order-success",
          element: (
            <CartProvider>
              <OrderSuccess />
            </CartProvider>
          ),
        },
        {
          path: "/orders-page",
          element: (
            <CartProvider>
              <Orders />
            </CartProvider>
          ),
        },
        {
          path: "/order-details/:orderId",
          element: (
            <CartProvider>
              <OrderDetails />
            </CartProvider>
          ),
        },
      ],
    },
  ],
};

export default OpenRoutes;
