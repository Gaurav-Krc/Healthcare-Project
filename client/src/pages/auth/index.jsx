import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to dashboard or homepage after successful login
        navigate("/chatbot");
      } else {
        const data = await response.json();
        setError(
          data.message || "Sign-in failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-violet-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg w-full max-w-md px-8 py-6"
      >
        <h1 className="text-2xl font-bold text-violet-600 mb-6">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 text-zinc-600 border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
            required
          />
        </div>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-4 py-2 mb-4 text-zinc-600 border rounded-sm focus:ring-1 focus:ring-violet-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-2.5 text-zinc-500 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
