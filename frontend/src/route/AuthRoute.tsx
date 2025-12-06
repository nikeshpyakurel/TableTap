import { RouteObject } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Category from "../pages/Category/Category";
import AdminManage from "../pages/AdminManage/AdminManage";
import Orders from "../pages/Orders/Orders";
import AddCategory from "../pages/Category/AddCategory";
import IconLibrary from "../pages/Category/IconLibrary";
import AddStaff from "../pages/AdminManage/AddStaff";
import AddProducts from "../pages/Products/AddProducts";
import OrderDetails from "../pages/Orders/OrderDetails";
import QuickFoodOrder from "../pages/QuickFoodOrder/QuickFoodOrder";
import CheckOut from "../pages/QuickFoodOrder/CheckOut";
import TablePage from "../pages/Table/Table";
import TableOrder from "../pages/Reception Order/ReceptionOrder";
import BookTable from "../pages/Reception Order/BookTable";
import Cart from "../pages/Reception Order/Cart";
import DownloadBill from "../pages/Reception Order/DownloadBill";
import ViewOrder from "../pages/Orders/ViewOrder";
import Billing from "../pages/Orders/Billing";
import ViewQuickOrder from "../pages/Orders/ViewQuickOrder";
import ViewReceptionOrder from "../pages/Orders/ViewReceptionOrder";
import ReceptionBilling from "../pages/Orders/ReceptionBilling";
import ImageLibray from "../pages/Products/ImageLibrary";
import ErrorComponent from "../errors/ErrorComponent";
import AddRoles from "../pages/RolesAndPermission/AddRoles";
import RolesAndPermission from "../pages/RolesAndPermission/RolesAndPermission";
// import CreateOffer from "../pages/CreateOffer/CreateOffer";
// import Offer from "../pages/CreateOffer/Offer";
import OrderHistory from "../pages/Orders/OrderHistory";
import HistoryDetails from "../pages/Orders/HistoryDetails";
import EditRole from "../pages/RolesAndPermission/EditRole";
import EditStaff from "../pages/AdminManage/EditStaff";
import ProtectedRoute from "./ProtectedRoute";
import { PermissionType } from "../type";

import ViewQuickOrders from "../pages/Orders/ViewQuickOrders";
import QuickOrderDetails from "../pages/Orders/QuickOrderDetails";
import ResetPassword from "../pages/Auth/ResetPassword";
import Myprofile from "../pages/settings/Myprofile";
import Setting from "../pages/settings/Setting";
import Profile from "../pages/Profile/Profile";
const dashboardRoute: RouteObject = {
  path: "/",
  element: <DashboardLayout />,
  errorElement: <ErrorComponent />,
  children: [
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "myprofile",
      element: <Profile />,
    },
    //For v 3.0
    // {
    //   path: "offer",
    //   element: <Offer />,
    // },
    // {
    //   path: "create-offer",
    //   element: (
    //     <ProtectedRoute requiredPermission={PermissionType.PRODUCT_MANAGEMENT}>
    //       <CreateOffer />
    //     </ProtectedRoute>
    //   ),
    // },
    {
      path: "products",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.VIEW_PRODUCT]}>
          <Products />
        </ProtectedRoute>
      ),
    },
    {
      path: "add-products",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.CREATE_PRODUCT]}>
          <AddProducts />
        </ProtectedRoute>
      ),
    },
    {
      path: "category",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.VIEW_CATEGORY]}>
          <Category />
        </ProtectedRoute>
      ),
    },

    {
      path: "orders",
      element: (
        <ProtectedRoute requiredPermission={[]}>
          <Orders />
        </ProtectedRoute>
      ),
    },
    {
      path: "quick-food-order",
      element: (
        <ProtectedRoute
          requiredPermission={[PermissionType.VIEW_TAKEAWAYORDER]}
        >
          <QuickFoodOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: "quick-food-order-checkout",
      element: (
        <ProtectedRoute
          requiredPermission={[
            PermissionType.DELETE_TAKEAWAYORDER,
            PermissionType.CREATE_TAKEAWAYORDER,
            PermissionType.UPDATE_TAKEAWAYORDER,
          ]}
        >
          <CheckOut />
        </ProtectedRoute>
      ),
    },

    {
      path: "add-category",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.CREATE_CATEGORY]}>
          <AddCategory />
        </ProtectedRoute>
      ),
    },
    {
      path: "icon-library",
      element: (
        <ProtectedRoute requiredPermission={[]}>
          <IconLibrary />
        </ProtectedRoute>
      ),
    },
    {
      path: "image-library",
      element: (
        <ProtectedRoute requiredPermission={[]}>
          <ImageLibray />
        </ProtectedRoute>
      ),
    },
    {
      path: "role-permission",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.VIEW_ROLE]}>
          <RolesAndPermission />
        </ProtectedRoute>
      ),
    },
    {
      path: "add-roles",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.CREATE_ROLE]}>
          <AddRoles />
        </ProtectedRoute>
      ),
    },
    {
      path: "edit-roles/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.UPDATE_ROLE]}>
          <EditRole />
        </ProtectedRoute>
      ),
    },

    {
      path: "admin-manage",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.VIEW_STAFF]}>
          <AdminManage />
        </ProtectedRoute>
      ),
    },
    {
      path: "add-staff-info",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.CREATE_STAFF]}>
          <AddStaff />
        </ProtectedRoute>
      ),
    },
    {
      path: "edit-staff",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.UPDATE_STAFF]}>
          <EditStaff />
        </ProtectedRoute>
      ),
    },
    {
      path: "order-details",
      element: (
        <ProtectedRoute requiredPermission={[]}>
          <OrderDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "table",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.VIEW_TABLE]}>
          <TablePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "order-details/:id",
      element: (
        <ProtectedRoute requiredPermission={[]}>
          <OrderDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "table-order",
      element: (
        <ProtectedRoute
          requiredPermission={[PermissionType.VIEW_RECEPTIONORDER]}
        >
          <TableOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: "book-table",
      element: (
        <ProtectedRoute
          requiredPermission={[PermissionType.CREATE_RECEPTIONORDER]}
        >
          <BookTable />
        </ProtectedRoute>
      ),
    },
    {
      path: "table-order-cart",
      element: (
        <ProtectedRoute
          requiredPermission={[PermissionType.CREATE_RECEPTIONORDER]}
        >
          <Cart />
        </ProtectedRoute>
      ),
    },
    {
      path: "download-bill",
      element: (
        <ProtectedRoute requiredPermission={[]}>
          <DownloadBill />
        </ProtectedRoute>
      ),
    },
    {
      path: "view-order/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.VIEW_TABLEORDER]}>
          <ViewOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: "billing",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.CREATE_TABLEORDER]}>
          <Billing />
        </ProtectedRoute>
      ),
    },
    {
      path: "view-quickorder/:id",
      element: (
        <ProtectedRoute
          requiredPermission={[PermissionType.VIEW_TAKEAWAYORDER]}
        >
          <ViewQuickOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: "view-receptionOrder/:id",
      element: (
        <ProtectedRoute
          requiredPermission={[PermissionType.VIEW_RECEPTIONORDER]}
        >
          <ViewReceptionOrder />
        </ProtectedRoute>
      ),
    },
    {
      path: "reception-billing/:id",
      element: (
        <ProtectedRoute
          requiredPermission={[PermissionType.CREATE_RECEPTIONORDER]}
        >
          <ReceptionBilling />
        </ProtectedRoute>
      ),
    },
    {
      path: "order-history",
      element: (
        <ProtectedRoute
          requiredPermission={[
            PermissionType.VIEW_RECEPTIONORDER,
            PermissionType.VIEW_TABLEORDER,
          ]}
        >
          <OrderHistory />
        </ProtectedRoute>
      ),
    },
    {
      path: "history-details/:id",
      element: <HistoryDetails />,
    },
    {
      path: "myprofile",
      element: <Myprofile />,
    },
    {
      path: "settings",
      element: <Setting />,
    },
    {
      path: "quick-orders",
      element: (
        <ProtectedRoute
          requiredPermission={[PermissionType.VIEW_TAKEAWAYORDER]}
        >
          <ViewQuickOrders />
        </ProtectedRoute>
      ),
    },
    {
      path: "quickOrder-details/:id",
      element: <QuickOrderDetails />,
    },
    {
      path: "reset-password",
      element: <ResetPassword />,
    },
  ],
};

export default dashboardRoute;
