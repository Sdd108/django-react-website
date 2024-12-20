from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Article
from datetime import datetime

class ArticleModelTests(TestCase):
    def setUp(self):
        self.article = Article.objects.create(
            title="Test Article",
            content="This is a test article content",
            author="Test Author",
            published_date=datetime.now(),
            source_url="https://example.com/test"
        )

    def test_article_creation(self):
        """Test article creation"""
        self.assertTrue(isinstance(self.article, Article))
        self.assertEqual(self.article.__str__(), self.article.title)

    def test_article_fields(self):
        """Test article fields"""
        self.assertEqual(self.article.title, "Test Article")
        self.assertEqual(self.article.content, "This is a test article content")
        self.assertEqual(self.article.author, "Test Author")
        self.assertTrue(isinstance(self.article.published_date, datetime))
        self.assertEqual(self.article.source_url, "https://example.com/test")

class ArticleAPITests(APITestCase):
    def setUp(self):
        # Create test articles
        self.article1 = Article.objects.create(
            title="First Test Article",
            content="Content for first test article",
            author="Test Author 1",
            published_date=datetime.now(),
            source_url="https://example.com/test1"
        )
        self.article2 = Article.objects.create(
            title="Second Test Article",
            content="Content for second test article",
            author="Test Author 2",
            published_date=datetime.now(),
            source_url="https://example.com/test2"
        )

    def test_get_articles_list(self):
        """Test getting list of articles"""
        url = reverse('article-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        self.assertEqual(response.data['count'], 2)

    def test_get_article_detail(self):
        """Test getting single article detail"""
        url = reverse('article-detail', args=[self.article1.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.article1.title)
        self.assertEqual(response.data['author'], self.article1.author)

    def test_article_pagination(self):
        """Test article pagination"""
        # Create 15 more articles for pagination testing
        for i in range(15):
            Article.objects.create(
                title=f"Article {i}",
                content=f"Content {i}",
                author=f"Author {i}",
                published_date=datetime.now(),
                source_url=f"https://example.com/test{i}"
            )

        url = reverse('article-list')
        response = self.client.get(url, {'page': 1, 'page_size': 10})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 10)
        self.assertEqual(response.data['count'], 17)  # 15 + 2 from setUp

    def test_invalid_article_detail(self):
        """Test getting detail of non-existent article"""
        url = reverse('article-detail', args=[999])  # Non-existent ID
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_article_search(self):
        """Test article search functionality"""
        url = reverse('article-list')
        response = self.client.get(url, {'search': 'First'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "First Test Article")

class ArticleFilterTests(APITestCase):
    def setUp(self):
        self.articles = [
            Article.objects.create(
                title="Python Article",
                content="Python content",
                author="Python Author",
                published_date=datetime.now(),
                source_url="https://example.com/python"
            ),
            Article.objects.create(
                title="Django Article",
                content="Django content",
                author="Django Author",
                published_date=datetime.now(),
                source_url="https://example.com/django"
            )
        ]

    def test_filter_by_author(self):
        """Test filtering articles by author"""
        url = reverse('article-list')
        response = self.client.get(url, {'author': 'Python Author'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['author'], "Python Author")

    def test_filter_by_title(self):
        """Test filtering articles by title"""
        url = reverse('article-list')
        response = self.client.get(url, {'title': 'Django'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Django Article")
