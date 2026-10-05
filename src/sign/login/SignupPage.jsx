import { useNavigate } from "react-router";
import Signup from "../../component/Signup";

const SignupPage = () => {
  const navigate = useNavigate();

  const goToLogin = (signupSuccess = false) =>
    navigate("/login", {
      state: signupSuccess ? { signupSuccess: true } : null,
    });

  return (
    <Signup
      pageMode
      onLogin={goToLogin}
    />
  );
};

export default SignupPage;