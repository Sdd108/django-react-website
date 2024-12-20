import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ScrollState {
  page: number;
  pageSize: number;
  position: number;
}

export const useScrollPosition = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isArticleDetail = pathname.includes('/article/');

  useEffect(() => {
    if (isArticleDetail) {
      // Save current scroll position and pagination state
      const currentState = JSON.parse(sessionStorage.getItem('articleListState') || '{}');
      if (!currentState.position) {
        currentState.position = window.scrollY;
        sessionStorage.setItem('articleListState', JSON.stringify(currentState));
      }
      window.scrollTo(0, 0);
    }
  }, [isArticleDetail]);

  const handleBackToArticles = (e: React.MouseEvent) => {
    e.preventDefault();
    const savedState: ScrollState = JSON.parse(sessionStorage.getItem('articleListState') || '{}');
    
    // Navigate with query params to maintain pagination state
    navigate(`/articles?page=${savedState.page || 1}&pageSize=${savedState.pageSize || 10}`);
    
    // Restore scroll position after navigation
    setTimeout(() => {
      window.scrollTo(0, savedState.position || 0);
    }, 100);
  };

  return { handleBackToArticles };
};
