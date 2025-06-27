import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = getUserFromToken();

  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
