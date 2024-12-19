from django.core.management.base import BaseCommand
from django.utils import timezone
from articles.models import Article
from datetime import timedelta

class Command(BaseCommand):
    help = 'Creates 10 test articles about cursors'

    def handle(self, *args, **kwargs):
        articles_data = [
            {
                'title': 'Understanding Database Cursors in PostgreSQL',
                'content': 'A database cursor is a control structure that enables traversal over the records in a database. In PostgreSQL, cursors are especially useful when dealing with large result sets, as they allow you to retrieve rows one at a time instead of all at once.',
                'author': 'Database Expert',
                'published_date': timezone.now() - timedelta(days=10),
                'source_url': 'https://example.com/postgres-cursors'
            },
            {
                'title': 'Mouse Cursors in CSS: A Complete Guide',
                'content': 'CSS provides various cursor properties to customize how the mouse pointer appears when hovering over elements. From basic pointers to custom cursors, this guide covers everything you need to know about cursor styling in web development.',
                'author': 'Frontend Developer',
                'published_date': timezone.now() - timedelta(days=9),
                'source_url': 'https://example.com/css-cursors'
            },
            {
                'title': 'Implementing Custom Cursors in React',
                'content': 'Learn how to implement custom cursor animations and behaviors in React applications. This tutorial covers cursor tracking, custom cursor components, and interactive cursor effects.',
                'author': 'React Developer',
                'published_date': timezone.now() - timedelta(days=8),
                'source_url': 'https://example.com/react-cursors'
            },
            {
                'title': 'MySQL Cursor Performance Optimization',
                'content': 'Cursors in MySQL can impact performance if not used properly. This article discusses best practices for optimizing cursor operations and alternatives to consider.',
                'author': 'Performance Engineer',
                'published_date': timezone.now() - timedelta(days=7),
                'source_url': 'https://example.com/mysql-cursors'
            },
            {
                'title': 'Game Development: Custom Cursor Design',
                'content': 'Creating engaging cursor designs for games can enhance user experience. Learn about cursor animation, state management, and implementation techniques in game development.',
                'author': 'Game Developer',
                'published_date': timezone.now() - timedelta(days=6),
                'source_url': 'https://example.com/game-cursors'
            },
            {
                'title': 'Cursor-based Pagination in GraphQL APIs',
                'content': 'Explore cursor-based pagination implementation in GraphQL APIs. This approach provides a reliable way to paginate through large datasets while maintaining consistency.',
                'author': 'Backend Developer',
                'published_date': timezone.now() - timedelta(days=5),
                'source_url': 'https://example.com/graphql-cursors'
            },
            {
                'title': 'Advanced T-SQL Cursor Techniques',
                'content': 'Deep dive into advanced cursor techniques in T-SQL, including fast forward cursors, dynamic cursors, and cursor variables. Learn when and how to use different cursor types effectively.',
                'author': 'SQL Expert',
                'published_date': timezone.now() - timedelta(days=4),
                'source_url': 'https://example.com/tsql-cursors'
            },
            {
                'title': 'Creating Interactive Cursor Effects with JavaScript',
                'content': 'Learn to create engaging cursor effects using vanilla JavaScript. Topics include cursor tracking, magnetic effects, and custom cursor trails.',
                'author': 'JavaScript Developer',
                'published_date': timezone.now() - timedelta(days=3),
                'source_url': 'https://example.com/js-cursors'
            },
            {
                'title': 'Cursor Management in MongoDB Aggregation',
                'content': 'Understanding cursor behavior in MongoDB aggregation pipelines. Learn about cursor methods, batch processing, and memory considerations.',
                'author': 'MongoDB Specialist',
                'published_date': timezone.now() - timedelta(days=2),
                'source_url': 'https://example.com/mongodb-cursors'
            },
            {
                'title': 'Accessibility Considerations for Custom Cursors',
                'content': 'When implementing custom cursors, accessibility should be a priority. Learn about WCAG guidelines, user preferences, and ensuring cursor visibility for all users.',
                'author': 'Accessibility Expert',
                'published_date': timezone.now() - timedelta(days=1),
                'source_url': 'https://example.com/accessible-cursors'
            },
        ]

        for article_data in articles_data:
            Article.objects.create(**article_data)
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created article: {article_data["title"]}')
            ) 