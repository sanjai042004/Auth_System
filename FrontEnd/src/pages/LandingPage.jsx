import { useState } from "react";
import { Register } from "./Auth/Register";
import { Login } from "./Auth/Login";
import { Button } from "../components/ui";
import { Link } from "react-router";

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
    <div className="min-h-screen flex flex-col justify-between bg-blue-50 ">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <Link to="/" className="text-2xl font-bold text-blue-700 cursor-pointer">MyApp</Link>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLogin(true)}
            className="mr-3 px-4 py-2 text-indigo-700 font-medium hover:underline cursor-pointer"
          >
            Login
          </button>
          <Button
            onClick={() => setShowRegister(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer "
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-center px-10 md:px-20 py-16 text-center md:text-left">
        <div className="flex-1 mb-10 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Welcome to <span className="text-indigo-600">MyApp</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Manage your tasks easily and securely.  
            Create an account or log in to get started!
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
          >
            Get Started
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src="https://images.pexels.com/photos/34433513/pexels-photo-34433513.jpeg"
            alt="Welcome Illustration"
            className="w-full max-w-md rounded-xl shadow-md"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-white shadow-inner text-gray-600 text-sm">
        © {new Date().getFullYear()} MyApp. All rights reserved.
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
