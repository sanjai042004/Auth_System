import { useEffect, useState, createContext, useContext } from "react";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  googleLogin as googleLoginService,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await refreshToken();
        if (res?.user) setUser(res.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const register = async (formData) => {
    const res = await registerUser(formData);
    if (res?.user) setUser(res.user);
    return res;
  };

  const login = async (formData) => {
    const res = await loginUser(formData);
    if (res?.user) setUser(res.user);
    return res;
  };

  const loginWithGoogle = async (token) => {
    const res = await googleLoginService(token);
    if (res?.user) setUser(res.user);
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
