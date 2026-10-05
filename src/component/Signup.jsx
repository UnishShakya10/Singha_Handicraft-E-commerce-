import { useState } from "react";
import {
  Alert,
  Anchor,
  Avatar,
  Button,
  FileButton,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Lock, Mail, User } from "lucide-react";
import { api } from "../lib/api";
import AuthPageLayout from "./AuthPageLayout";

const Signup = ({ opened, onClose, onLogin, pageMode = false }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      const res = await api.post("/users/create", formData);

      if (res.data === "Email already exists" || res.data?.message === "Email already exists") {
        setMessage("This email is already registered.");
        return;
      }

      if (!res.data?.user) {
        setMessage("Account could not be created.");
        return;
      }

      if (onLogin) {
        onLogin(true);
      } else {
        setSuccessMessage("Account created. Please sign in to continue.");
        setPassword("");
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
      <form onSubmit={handleSignup}>
        <Stack className={pageMode ? "auth-form-fields" : undefined}>
          <TextInput
            label="Full name"
            placeholder="Your name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.currentTarget.value)}
            leftSection={<User size={16} />}
            size={pageMode ? "md" : undefined}
          />
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
            placeholder="Create a password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            leftSection={<Lock size={16} />}
            size={pageMode ? "md" : undefined}
          />
          <Group className={pageMode ? "auth-avatar-control" : undefined}>
            <Avatar
              src={avatar ? URL.createObjectURL(avatar) : undefined}
              size={56}
              radius="xl"
              color="gold"
            >
              <User size={22} />
            </Avatar>
            <div>
              <Text size="sm" fw={500}>Profile photo</Text>
              <Text size="xs" c="dimmed">Optional</Text>
            </div>
            <FileButton onChange={setAvatar} accept="image/*">
              {(props) => (
                <Button {...props} variant="light" color="dark" size="sm">
                  Choose photo
                </Button>
              )}
            </FileButton>
          </Group>
          {message && (
            <Alert color="red" variant="light">
              {message}
            </Alert>
          )}
          {successMessage && (
            <Alert color="green" variant="light">
              {successMessage}
            </Alert>
          )}
          <Button type="submit" color="dark" loading={loading} fullWidth className={pageMode ? "auth-submit" : undefined}>
            Create account
          </Button>
        </Stack>
      </form>

      <Text size="sm" ta="center" mt="md" className={pageMode ? "auth-form-switch" : undefined}>
        Already registered?{" "}
        <Anchor component="button" type="button" fw={600} c="dark" onClick={() => onLogin?.()}>
          Sign in
        </Anchor>
      </Text>
    </>
  );

  if (pageMode) {
    return (
      <AuthPageLayout
        eyebrow="JOIN THE ATELIER"
        title="Create account"
        description="Save your favourite works and keep every enquiry in one place."
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
            Join the atelier
          </Text>
          <Title order={2} ta="center">
            Create account
          </Title>
        </Stack>
      }
    >
      {formContent}
    </Modal>
  );
};

export default Signup;
