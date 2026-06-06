import { useState } from "react";
import {
  Button,
  Container,
  Field,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { apiFetch, readJsonOrFallback } from "@/lib/api";
import { useAuthStore, type User } from "@/stores/authStore";
import { Link, Navigate, useNavigate } from "react-router-dom";

interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

interface RegisterErrors {
  username?: string;
  email?: string;
  password?: string;
  password2?: string;
  non_field_errors?: string | string[];
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    // 已登录用户不需要注册新账号，直接进入文章列表。
    return <Navigate to="/articles" replace />;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 输入变化时清理对应字段错误，保持表单反馈和当前输入同步。
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    // 注册成功后立即保存登录态，减少用户再次登录的步骤。
    event.preventDefault();
    setErrors({});

    if (form.password !== form.password2) {
      setErrors({ password2: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    const res = await apiFetch("/auth/register/", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await readJsonOrFallback<RegisterErrors>(res, {
        non_field_errors: ["Registration failed."],
      });
      setErrors(data);
      setIsSubmitting(false);
      return;
    }

    const data = (await res.json()) as AuthResponse;
    setAuth(data.user, data.access, data.refresh);
    navigate("/articles", { replace: true });
  };

  const formError = Array.isArray(errors.non_field_errors)
    ? errors.non_field_errors[0]
    : errors.non_field_errors;

  return (
    <Container maxW="520px" py={16}>
      <form onSubmit={handleSubmit}>
        <VStack gap={6} alignItems="stretch">
          <VStack gap={2} textAlign="center">
            <Heading as="h1" size="3xl">
              Create Account
            </Heading>
            <Text color="fg.muted">Publish and manage your own articles.</Text>
          </VStack>

          <Field.Root invalid={!!errors.username} required>
            <Field.Label>Username</Field.Label>
            <Input
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            {errors.username && (
              <Field.ErrorText>{errors.username}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.email} required>
            <Field.Label>Email</Field.Label>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.password} required>
            <Field.Label>Password</Field.Label>
            <Input
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <Field.ErrorText>{errors.password}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.password2} required>
            <Field.Label>Confirm Password</Field.Label>
            <Input
              name="password2"
              type="password"
              autoComplete="new-password"
              value={form.password2}
              onChange={handleChange}
              required
            />
            {errors.password2 && (
              <Field.ErrorText>{errors.password2}</Field.ErrorText>
            )}
          </Field.Root>

          {formError && <Text color="fg.error">{formError}</Text>}

          <Button
            type="submit"
            colorPalette="blue"
            loading={isSubmitting}
            loadingText="Creating account..."
          >
            Create Account
          </Button>

          <Text color="fg.muted" textAlign="center">
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "underline" }}>
              Sign in
            </Link>
          </Text>
        </VStack>
      </form>
    </Container>
  );
};

export default RegisterPage;
