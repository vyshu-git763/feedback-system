import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import API from "../services/api";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ login_field: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    if (role === "manager" || role === "employee") {
      setSelectedRole(role);
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const loginField = form.login_field;
    const payload = loginField.includes("@")
      ? { email: loginField, password: form.password }
      : { username: loginField, password: form.password };

    try {
      const response = await API.post("/login", payload);
      const token = response.data.access_token;
      if (!token) {
        setError("No token received. Please check your credentials.");
        return;
      }
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const role = decodedToken.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "manager") navigate("/manager");
      else if (role === "employee") navigate("/employee");
    }
    catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401 || err.response?.status === 422) {
        setError("Invalid username/email or password.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-arctic px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-title mb-2 text-center">Login</h2>
        {selectedRole && (
          <p className="text-sm text-gray-600 mb-4 text-center italic">
            Logging in as <span className="font-semibold text-primary">{selectedRole}</span>
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username or Email</label>
            <input
              name="login_field"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your username/email"
              value={form.login_field}
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
                placeholder="Enter your password"
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

          {error && <p className="text-coralFG text-sm italic mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 mt-4 rounded hover:bg-title transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to={`/signup?role=${selectedRole}`}
            className="text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
