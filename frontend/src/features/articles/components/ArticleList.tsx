/*
 * @Author: “Zhipeng “zhipengmail@qq.com”
 * @Date: 2024-12-19 17:15:12
 * @LastEditors: “Zhipeng “zhipengmail@qq.com”
 * @LastEditTime: 2024-12-19 19:02:12
 * @FilePath: /django-react-website/frontend/src/components/ArticleBox.tsx
 * @Description: Article list component that displays a list of articles fetched from the API
 */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
}

const ArticleBox = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Article[]>(
          "http://localhost:8000/api/articles/"
        );
        setArticles(response.data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching articles"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="articles">
      <h1>Articles</h1>
      {articles.length === 0 ? (
        <p>No articles found</p>
      ) : (
        articles.map((article) => (
          <Link
            to={`/article/${article.id}`}
            key={article.id}
            className="article-link"
          >
            <div className="article">
              <h2>{article.title}</h2>
              <p>By {article.author}</p>
              <p>{article.content.substring(0, 150)}...</p>
              <div className="article-meta">
                <small>
                  Published:{" "}
                  {new Date(article.published_date).toLocaleDateString()}
                </small>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ArticleBox;
