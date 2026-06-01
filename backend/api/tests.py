from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from articles.models import Article
from datetime import datetime


class RootEndpointTests(TestCase):
    def test_root_returns_welcome_json(self):
        """Test that the root endpoint returns a welcome message"""
        # 根接口作为简单健康检查，应返回可发现的 API 入口。
        url = reverse("index")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertIn("articles", response.json()["endpoints"])
        self.assertIn("admin", response.json()["endpoints"])


class ArticleAPIEndpointTests(APITestCase):
    def setUp(self):
        # 每个 API 用例都从一条基础文章开始，便于断言 count 和详情字段。
        self.article = Article.objects.create(
            title="API Test Article",
            content="Content for API endpoint test.",
            author="API Tester",
            published_date=datetime(2024, 1, 15),
            source_url="https://example.com/api-test",
        )

    def test_articles_list_endpoint(self):
        """Test GET /api/articles/ returns paginated list"""
        url = reverse("article-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertIn("count", response.data)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(len(response.data["results"]), 1)

    def test_article_detail_endpoint(self):
        """Test GET /api/articles/:id/ returns single article"""
        url = reverse("article-detail", args=[self.article.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.article.id)
        self.assertEqual(response.data["title"], "API Test Article")
        self.assertEqual(response.data["author"], "API Tester")

    def test_article_not_found(self):
        """Test GET /api/articles/999/ returns 404"""
        url = reverse("article-detail", args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_articles_list_is_paginated(self):
        """Test that articles list is paginated with correct structure"""
        url = reverse("article-list")
        response = self.client.get(url)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)

    def test_create_article_endpoint(self):
        """Test POST /api/articles/ creates an article"""
        # 创建接口应接受完整文章 payload，并返回新建对象的序列化结果。
        url = reverse("article-list")
        data = {
            "title": "Created Article",
            "content": "This article was created through the API.",
            "author": "API Author",
            "published_date": "2026-01-10T12:30:00Z",
            "source_url": "https://example.com/created-article",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Created Article")
        self.assertEqual(Article.objects.count(), 2)

    def test_create_article_requires_title(self):
        """Test POST /api/articles/ returns validation errors"""
        # 缺失必填字段时，DRF 应返回字段级错误，前端会把它映射到表单。
        url = reverse("article-list")
        data = {
            "content": "Missing a required title.",
            "author": "API Author",
            "published_date": "2026-01-10T12:30:00Z",
            "source_url": "https://example.com/missing-title",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_create_article_source_url_optional(self):
        """Test POST /api/articles/ succeeds without source_url"""
        # source_url 是可选字段；不传时后端应保存为空字符串而不是拒绝请求。
        url = reverse("article-list")
        data = {
            "title": "Article Without Source",
            "content": "This article does not have a source URL.",
            "author": "API Author",
            "published_date": "2026-01-10T12:30:00Z",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["source_url"], "")
        self.assertEqual(Article.objects.count(), 2)
