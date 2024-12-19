/*
 * @Author: “Zhipeng “zhipengmail@qq.com”
 * @Date: 2024-12-19 17:14:22
 * @LastEditors: “Zhipeng “zhipengmail@qq.com”
 * @LastEditTime: 2024-12-19 17:18:27
 * @FilePath: /django-react-website/frontend/src/App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArticleBox from "./components/ArticleBox";
import Article from "./components/Article";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ArticleBox />} />
          <Route path="/article/:id" element={<Article />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
