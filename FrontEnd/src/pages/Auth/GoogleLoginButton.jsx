import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

export const GoogleLoginButton = () => {
  const { loginWithGoogle } = useAuth();

  const handleSuccess = async (response) => {
    try {
      const { credential } = response;
      await loginWithGoogle(credential);
      console.log("Google Login Success");
    } catch (error) {
      console.error("Google Login Error:", error.response?.data || error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full rounded-2xl border overflow-hidden shadow-lg">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Google Login Failed")}
        />
      </div>
    </div>
  );
};
