import { useState } from "react";
import { Modal, Button, InputField } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { GoogleLoginButton } from "./GoogleLoginButton";

export const Register = ({ isOpen, onClose, switchToLogin }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password)
      return setMessage("All fields are required.");
    if (form.password.length < 8)
      return setMessage("Password must be at least 8 characters long.");

    setLoading(true);
    try {
      const res = await register(form);
      setMessage(res.message || "✅ Registration successful!");
      setForm({ name: "", email: "", password: "" });

      setTimeout(() => handleClose(), 1500);
    } catch (error) {
      console.error("Register Error:", error);
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: "", email: "", password: "" });
    setMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Your Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={loading} className="space-y-4">
          <InputField
            id="name"
            label="Name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
          />
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            showToggle
          />

          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </fieldset>

        {message && (
          <p
            className={`text-center text-sm transition-colors ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Switch to Login */}
        <p className="mt-5 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              handleClose();
              switchToLogin();
            }}
          >
            Login
          </button>
        </p>

        {/* 👇 Google Login Section */}
        <div className="mt-5 flex flex-col items-center">
          <div className="flex items-center w-full mb-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <GoogleLoginButton />
        </div>
      </form>
    </Modal>
  );
};
