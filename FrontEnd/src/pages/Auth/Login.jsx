import { useState } from "react";
import { Modal,Button,InputField } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";


export const Login = ({ isOpen, onClose, switchToRegister }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (message) setMessage("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password)
    return setMessage("Please fill in all fields.");

  setLoading(true);
  try {
    const res = await login(form);
    setMessage(res.message || "Login successful!");
    setForm({ email: "", password: "" });

    setTimeout(() => handleClose(), 1000);
  } catch (error) {
    console.error("Login error:", error);
    setMessage(error.response?.data?.message || "Invalid credentials.");
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    setForm({ email: "", password: "" });
    setMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Welcome Back 👋">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <fieldset disabled={loading} className="space-y-4">
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            showToggle
            autoComplete="current-password"
          />

          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
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

        <p className="mt-5 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              handleClose();
              switchToRegister();
            }}
          >
            Register
          </button>
        </p>
      </form>
    </Modal>
  );
};
