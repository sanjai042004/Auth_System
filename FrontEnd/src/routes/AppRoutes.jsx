import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { ResetPassword } from "../pages/Auth/ResetPassword";

export const AppRoutes = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/dashboard", element: <Dashboard /> },
    { path: "/reset-password/:token", element: <ResetPassword /> }
]);
 