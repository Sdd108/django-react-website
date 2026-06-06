import { useAuthStore } from "@/stores/authStore";

const BASE_URL = "/api";

interface ApiErrorFallback {
  non_field_errors: string[];
}

const getHeaders = (headers: HeadersInit | undefined, token: string | null) => {
  // 所有 API 请求统一补齐 JSON 和认证头，避免页面各自重复处理。
  const nextHeaders = new Headers(headers);
  if (!nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }
  if (token) {
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }
  return nextHeaders;
};

const refreshAccessToken = async () => {
  // 访问令牌过期时尝试用 refresh token 换新，失败则清空登录态。
  const { refreshToken, user, setAccessToken, clearAuth } =
    useAuthStore.getState();
  if (!refreshToken || !user) {
    clearAuth();
    return null;
  }

  const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) {
    clearAuth();
    return null;
  }

  const data = (await res.json()) as { access: string };
  setAccessToken(data.access);
  return data.access;
};

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  // 包装 fetch，让业务页面默认获得认证头和一次自动刷新令牌的能力。
  const token = useAuthStore.getState().accessToken;
  const requestOptions = {
    ...options,
    headers: getHeaders(options.headers, token),
  };

  let res = await fetch(`${BASE_URL}${path}`, requestOptions);
  if (res.status !== 401 || path === "/auth/token/refresh/") {
    return res;
  }

  const refreshedToken = await refreshAccessToken();
  if (!refreshedToken) return res;

  res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: getHeaders(options.headers, refreshedToken),
  });

  if (res.status === 401) {
    useAuthStore.getState().clearAuth();
  }

  return res;
}

export async function readJsonOrFallback<T>(
  res: Response,
  fallback: ApiErrorFallback,
): Promise<T> {
  return res.json().catch(() => fallback) as Promise<T>;
}
