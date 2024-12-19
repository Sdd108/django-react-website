import { axiosInstance } from '@/services/api/axios';
import { Article } from '../types/article.types';

export const getArticles = () => {
  return axiosInstance.get<Article[]>('/api/articles/');
};

export const getArticle = (id: string) => {
  return axiosInstance.get<Article>(`/api/articles/${id}/`);
}; 