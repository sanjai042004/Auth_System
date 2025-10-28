import { useState } from "react";
import { Register } from "./Auth/Register";
import { Login } from "./Auth/Login";
import { Button } from "../components/ui";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


export const LandingPage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <Link to="/" className="text-2xl font-extrabold text-indigo-700">
          TaskFlow
        </Link>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowLogin(true)}
            className="text-indigo-700 font-medium hover:underline"
          >
            Login
          </button>
          <Button
            onClick={() => setShowRegister(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-center px-8 md:px-16 py-20 gap-12">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your <span className="text-indigo-600">Dashboard</span> for
            Productivity
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Manage your tasks, track your goals, and visualize your progress —
            all in one simple, beautiful dashboard.
          </p>
          <Button
            onClick={() => setShowRegister(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </Button>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex justify-center"
        >
          <img
            src=""
            alt="Dashboard Preview"
            className="rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg"
          />
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="py-16 px-8 md:px-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          Everything You Need in One Place
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Real-Time Updates",
              desc: "Your data stays synced automatically — no refresh needed.",
              // img: feature1,
            },
            {
              title: "Analytics Dashboard",
              desc: "Track performance and progress visually and clearly.",
              // img: feature2,
            },
            {
              title: "Secure Access",
              desc: "Multi-layer authentication keeps your data protected.",
              // img: feature3,
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-indigo-50 p-8 rounded-2xl shadow hover:shadow-lg transition text-left"
            >
              <img
                src=""
                alt={feature.title}
                className="w-16 h-16 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-indigo-700">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-indigo-700 text-white text-center text-sm mt-auto">
        © {new Date().getFullYear()} TaskFlow. Designed for productivity.
      </footer>

      {/* Register Modal */}
      <Register
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        switchToLogin={switchToLogin}
      />

      {/* Login Modal */}
      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        switchToRegister={switchToRegister}
      />
    </div>
  );
};
