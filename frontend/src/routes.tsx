import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import ErrorPage from "./pages/ErrorPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticleCreatePage from "./pages/ArticleCreatePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// 前端所有页面路由都挂在 Layout 下，统一复用导航栏和页脚。
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // 未匹配路径或路由异常会渲染统一错误页。
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      // 注意 articles/new 必须放在 articles/:id 前面，避免被动态 id 路由吞掉。
      { path: "articles", element: <ArticlesPage /> },
      { path: "articles/new", element: <ArticleCreatePage /> },
      { path: "articles/:id", element: <ArticleDetailPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);

export default router;
