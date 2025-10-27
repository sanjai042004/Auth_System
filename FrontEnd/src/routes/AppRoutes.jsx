import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { Dashboard } from "../pages/Dashboard/Dashboard";

export const AppRoutes = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/dashboard", element: <Dashboard /> },
]);
