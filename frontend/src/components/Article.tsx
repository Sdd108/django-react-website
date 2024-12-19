import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface ArticleType {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
  created_at: string;
  updated_at: string;
}

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ArticleType>(
          `http://localhost:8000/api/articles/${id}/`
        );
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching the article"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading article...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="article-detail">
      <Link to="/" className="back-link">
        ← Back to Articles
      </Link>
      <h1>{article.title}</h1>
      <div className="article-meta">
        <p>By {article.author}</p>
        <p>
          Published: {new Date(article.published_date).toLocaleDateString()}
        </p>
      </div>
      <div className="article-content">{article.content}</div>
      <div className="article-footer">
        <a href={article.source_url} target="_blank" rel="noopener noreferrer">
          Original Source
        </a>
      </div>
    </div>
  );
};

export default Article;