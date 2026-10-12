import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const CustomerRoute = () => {
  const { role } = useAuth();

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default CustomerRoute;
