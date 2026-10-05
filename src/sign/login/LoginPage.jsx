import { useLocation, useNavigate } from "react-router";
import Login from "../../component/Login";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Login
      pageMode
      signupSuccess={location.state?.signupSuccess}
      onSignup={() => navigate("/signup")}
      onSuccess={(_, destination) => navigate(destination, { replace: true })}
    />
  );
};

export default LoginPage;