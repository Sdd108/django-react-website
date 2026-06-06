import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 登录态集中保存在 Zustand 中，页面和 API 工具可以共享同一份认证信息。
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      setAccessToken: (accessToken) =>
        set((state) => ({
          accessToken,
          isAuthenticated: !!state.user,
        })),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
