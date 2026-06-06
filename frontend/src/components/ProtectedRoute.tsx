import { useAuthStore } from "@/stores/authStore";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // 保存当前目标路由，登录成功后可以把用户带回原页面。
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
