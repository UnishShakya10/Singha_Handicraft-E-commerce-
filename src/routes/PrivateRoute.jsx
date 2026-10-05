import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login"  />;
  }

  return <Outlet />;
};

export default PrivateRoute;