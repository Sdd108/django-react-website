/*
 * @Author: “Zhipeng “zhipengmail@qq.com”
 * @Date: 2024-12-19 17:14:22
 * @LastEditors: “Zhipeng “zhipengmail@qq.com”
 * @LastEditTime: 2025-08-17 11:21:10
 * @FilePath: /django-react-website/frontend/src/main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
