import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="200105343208-6gigoputg1r8ehnf1kr3qot2kuh44okd.apps.googleusercontent.com"> 
  <AuthProvider>
    <RouterProvider router={AppRoutes} />
  </AuthProvider>
  </GoogleOAuthProvider>
);
