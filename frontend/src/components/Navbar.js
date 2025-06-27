import { useNavigate, Link } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo.jpeg";
import { getUserFromToken } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navLinkClass =
    "flex items-center gap-1 text-white hover:underline hover:decoration-white hover:underline-offset-4 transition duration-150";

  return (
    <nav className="bg-gradient-to-r from-title via-twilight to-primary text-white py-4 px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          alt="Company Logo"
          className="h-10 w-10 rounded-full shadow-sm"
        />
        <span className="text-2xl font-bold tracking-wide">DPDZero</span>
      </div>

      <div className="flex gap-6 items-center text-sm font-medium">
        <Link to="/home" className={navLinkClass}>
          <HomeIcon className="h-5 w-5" /> Home
        </Link>

        {role === "manager" && (
          <Link to="/manager" className={navLinkClass}>
            <ChartBarIcon className="h-5 w-5" /> Dashboard
          </Link>
        )}

        {role === "employee" && (
          <Link to="/employee" className={navLinkClass}>
            <UserGroupIcon className="h-5 w-5" /> Dashboard
          </Link>
        )}

        <span
          onClick={handleLogout}
          className={`${navLinkClass} cursor-pointer`}
        >
          <PowerIcon className="h-5 w-5" /> Logout
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
