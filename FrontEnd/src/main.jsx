import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={AppRoutes} />
  </AuthProvider>
);
