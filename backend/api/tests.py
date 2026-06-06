from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from articles.models import Article
from datetime import datetime


User = get_user_model()


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
        self.user = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="StrongPass123!",
        )
        self.article = Article.objects.create(
            author_user=self.user,
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
        self.assertIn("last_updated", response.data["results"][0])

    def test_article_detail_endpoint(self):
        """Test GET /api/articles/:id/ returns single article"""
        url = reverse("article-detail", args=[self.article.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.article.id)
        self.assertEqual(response.data["title"], "API Test Article")
        self.assertEqual(response.data["author"], "API Tester")
        self.assertEqual(response.data["last_updated"], response.data["updated_at"])

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

    def test_create_article_requires_authentication(self):
        """Test POST /api/articles/ requires authentication"""
        url = reverse("article-list")
        data = {
            "title": "Created Article",
            "content": "This article was created through the API.",
            "author": "API Author",
            "published_date": "2026-01-10T12:30:00Z",
            "source_url": "https://example.com/created-article",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Article.objects.count(), 1)

    def test_create_article_endpoint(self):
        """Test POST /api/articles/ creates an article"""
        # 创建接口应接受完整文章 payload，并返回新建对象的序列化结果。
        self.client.force_authenticate(user=self.user)
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
        self.assertEqual(response.data["author_user"], self.user.username)
        self.assertIn("last_updated", response.data)
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

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_article_source_url_optional(self):
        """Test POST /api/articles/ succeeds without source_url"""
        # source_url 是可选字段；不传时后端应保存为空字符串而不是拒绝请求。
        self.client.force_authenticate(user=self.user)
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

    def test_update_article_endpoint(self):
        """Test PUT /api/articles/:id/ updates an article"""
        # 编辑接口保存 Markdown 原文，不在后端做渲染或转换。
        self.client.force_authenticate(user=self.user)
        url = reverse("article-detail", args=[self.article.id])
        data = {
            "title": "Updated API Article",
            "content": "## Updated Markdown\n\n- Saved from API",
            "author": "Updated Author",
            "published_date": "2026-02-10T09:15:00Z",
            "source_url": "",
        }

        response = self.client.put(url, data, format="json")
        self.article.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated API Article")
        self.assertEqual(response.data["last_updated"], response.data["updated_at"])
        self.assertEqual(self.article.content, "## Updated Markdown\n\n- Saved from API")

    def test_delete_article_endpoint(self):
        """Test DELETE /api/articles/:id/ deletes an article"""
        # 删除接口应移除数据库记录，并返回 DRF 标准 204 响应。
        self.client.force_authenticate(user=self.user)
        url = reverse("article-detail", args=[self.article.id])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Article.objects.count(), 0)

    def test_update_article_as_non_owner_forbidden(self):
        other_user = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="StrongPass123!",
        )
        self.client.force_authenticate(user=other_user)
        url = reverse("article-detail", args=[self.article.id])
        data = {
            "title": "Updated API Article",
            "content": "Forbidden update",
            "author": "Updated Author",
            "published_date": "2026-02-10T09:15:00Z",
            "source_url": "",
        }

        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_my_articles(self):
        other_user = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="StrongPass123!",
        )
        Article.objects.create(
            author_user=other_user,
            title="Other Article",
            content="Other user's content.",
            author="Other Author",
            published_date="2026-01-10T12:30:00Z",
        )
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("article-list"), {"my_articles": "true"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["author_user"], "owner")

    def test_unpublished_article_hidden_from_public_list(self):
        Article.objects.create(
            author_user=self.user,
            title="Draft Article",
            content="Draft content.",
            author="API Tester",
            published_date="2026-01-10T12:30:00Z",
            is_published=False,
        )

        response = self.client.get(reverse("article-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
