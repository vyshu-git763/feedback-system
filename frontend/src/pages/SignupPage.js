import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/signup", form);
      console.log("Signup response:", response.data);
      alert("Signup successful! Now please login.");
      navigate('/login?role=${form.role)');
    } catch (err) {
      console.error("Signup error:", err);

      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Signup failed. Try a different username.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-arctic px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-title mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              name="username"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter a username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                placeholder="Enter a password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ WebkitAppearance: "none", appearance: "none" }}
            >
              <option className="bg-white text-gray-700 hover:bg-primary hover:text-white" value="employee">
                Employee
              </option>
              <option className="bg-white text-gray-700 hover:bg-primary hover:text-white" value="manager">
                Manager
              </option>
            </select>
          </div>

          {error && <p className="text-coralFG text-sm italic mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-title transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <a href="/" className="text-primary hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
