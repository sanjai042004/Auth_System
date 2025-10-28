import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, InputField } from "../../components/ui";
import { api } from "../../services/api";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessage("");
  }, [newPassword, confirmPassword]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!newPassword || !confirmPassword) {
      return setMessage("Please fill all fields.");
    }
    if (newPassword.length < 8) {
      return setMessage("Password must be at least 8 characters.");
    }
    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await api.post(
        "/auth/reset-password",
        { token, newPassword },
        { withCredentials: true }
      );

      setMessage(`✅ ${res.data.message}`);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to reset password.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <InputField
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          {message && (
            <p
              className={`text-center text-sm mt-2 ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
