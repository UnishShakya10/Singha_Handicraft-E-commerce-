import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Alert,
  Anchor,
  Button,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Lock, Mail } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AuthPageLayout from "./AuthPageLayout";

const Login = ({ opened, onClose, onSignup, onSuccess, pageMode = false, signupSuccess = false }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/users/login", { email, password });
      const data = res.data;

      if (!data?.token || !data?.user) {
        setMessage(typeof data === "string" ? data : "Unable to sign in.");
        return;
      }

      const authenticatedUser = login(data.token, data.user);
      const destination = location.state?.from?.pathname ||
        (authenticatedUser.role === "admin" ? "/admin" : "/home");
      if (onSuccess) {
        onSuccess(authenticatedUser, destination);
      } else {
        onClose();
        navigate(destination, { replace: true });
      }
    } catch (error) {
      const payload = error.response?.data;
      setMessage(
        typeof payload === "string"
          ? payload
          : payload?.message || "The studio server is not responding."
      );
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
      <form onSubmit={handleLogin}>
        <Stack className={pageMode ? "auth-form-fields" : undefined}>
          {signupSuccess && (
            <Alert color="green" variant="light">
              Account created. Please sign in to continue.
            </Alert>
          )}
          <TextInput
            label="Email"
            placeholder="you@email.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            leftSection={<Mail size={16} />}
            size={pageMode ? "md" : undefined}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            leftSection={<Lock size={16} />}
            size={pageMode ? "md" : undefined}
          />
          {message && (
            <Alert color="red" variant="light">
              {message}
            </Alert>
          )}
          <Button type="submit" color="dark" loading={loading} fullWidth className={pageMode ? "auth-submit" : undefined}>
            Sign in
          </Button>
        </Stack>
      </form>

      <Text size="sm" ta="center" mt="md" className={pageMode ? "auth-form-switch" : undefined}>
        New to Singha?{" "}
        <Anchor component="button" type="button" fw={600} c="dark" onClick={onSignup}>
          Create an account
        </Anchor>
      </Text>
    </>
  );

  if (pageMode) {
    return (
      <AuthPageLayout
        eyebrow="WELCOME BACK"
        title="Sign in"
        description="Access your collection and saved enquiries."
      >
        {formContent}
      </AuthPageLayout>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      radius="md"
      overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
      title={
        <Stack gap={4}>
          <Text size="xs" tt="uppercase" lts={3} c="gold.6" ta="center">
            Welcome back
          </Text>
          <Title order={2} ta="center">
            Sign in
          </Title>
        </Stack>
      }
    >
      <Text c="dimmed" size="sm" ta="center" mb="md">
        Access your collection and saved enquiries.
      </Text>
      {formContent}
    </Modal>
  );
};

export default Login;
