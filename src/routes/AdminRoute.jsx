import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;