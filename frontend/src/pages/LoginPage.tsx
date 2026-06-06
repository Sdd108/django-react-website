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
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

interface LoginErrors {
  username?: string;
  password?: string;
  detail?: string;
  non_field_errors?: string | string[];
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    // 已登录用户不需要再次访问登录页，直接回到文章工作区。
    return <Navigate to="/articles" replace />;
  }

  // 被保护页面重定向到登录页时，登录成功后返回原始目标。
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/articles";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 用户修正字段时清掉对应错误，避免旧错误继续占据表单状态。
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, detail: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    // 登录成功后保存用户和 token，后续 API 请求会自动带上认证头。
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const res = await apiFetch("/auth/login/", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await readJsonOrFallback<LoginErrors>(res, {
        non_field_errors: ["Login failed."],
      });
      setErrors(data);
      setIsSubmitting(false);
      return;
    }

    const data = (await res.json()) as AuthResponse;
    setAuth(data.user, data.access, data.refresh);
    navigate(from, { replace: true });
  };

  const formError = Array.isArray(errors.non_field_errors)
    ? errors.non_field_errors[0]
    : errors.non_field_errors;

  return (
    <Container maxW="480px" py={16}>
      <form onSubmit={handleSubmit}>
        <VStack gap={6} alignItems="stretch">
          <VStack gap={2} textAlign="center">
            <Heading as="h1" size="3xl">
              Sign In
            </Heading>
            <Text color="fg.muted">Access your article workspace.</Text>
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

          <Field.Root invalid={!!errors.password} required>
            <Field.Label>Password</Field.Label>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <Field.ErrorText>{errors.password}</Field.ErrorText>
            )}
          </Field.Root>

          {(errors.detail || formError) && (
            <Text color="fg.error">{errors.detail || formError}</Text>
          )}

          <Button
            type="submit"
            colorPalette="blue"
            loading={isSubmitting}
            loadingText="Signing in..."
          >
            Sign In
          </Button>

          <Text color="fg.muted" textAlign="center">
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: "underline" }}>
              Sign up
            </Link>
          </Text>
        </VStack>
      </form>
    </Container>
  );
};

export default LoginPage;
