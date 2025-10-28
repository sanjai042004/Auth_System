import { useState } from "react";
import { Button, InputField, Modal } from "../../components/ui";
import { api } from "../../services/api";

export const ForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Submit
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(
        "/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      setMessage(`${res.data.message}`);
      setEmail("");
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to send reset link.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forgot Password">
      <form className="space-y-4" onSubmit={handleForgotPassword}>
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Sending link..." : "Send Reset Link"}
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
    </Modal>
  );
};
