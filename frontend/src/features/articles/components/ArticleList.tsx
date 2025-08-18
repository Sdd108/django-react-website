import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pagination } from "antd";
import axios from "axios";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
}

interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

const ArticleBox = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("pageSize")) || 10
  );

  useEffect(() => {
    // Update URL when pagination changes
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("pageSize", pageSize.toString());
    window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
  }, [currentPage, pageSize]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PaginatedResponse<Article>>(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/articles/?page=${currentPage}&page_size=${pageSize}`
        );
        setArticles(response.data.results);
        setTotal(response.data.count);
        setError(null);
        // Restore scroll position after articles are loaded
        const savedState = JSON.parse(
          sessionStorage.getItem("articleListState") || "{}"
        );
        if (savedState.position) {
          setTimeout(() => {
            window.scrollTo(0, savedState.position);
            // Clear the saved position after restoring
            delete savedState.position;
            sessionStorage.setItem(
              "articleListState",
              JSON.stringify(savedState)
            );
          }, 100);
        }
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
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    window.scrollTo(0, 0);
  };

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="articles">
      <h1>Articles</h1>
      {articles.length === 0 ? (
        <p>No articles found</p>
      ) : (
        <>
          {articles.map((article) => (
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
          ))}
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={true}
              onShowSizeChange={handlePageSizeChange}
              pageSizeOptions={["10", "20", "50", "100"]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleBox;
