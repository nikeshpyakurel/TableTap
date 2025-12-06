import { createBrowserRouter } from "react-router-dom";
import dashboardRoute from "./AuthRoute";
import OpenRoutes from "./OpenRoute";

const router = createBrowserRouter([OpenRoutes, dashboardRoute]);

export default router;
