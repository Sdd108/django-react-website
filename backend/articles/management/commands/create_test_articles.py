from django.core.management.base import BaseCommand
from django.utils import timezone
from articles.models import Article
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Creates 55 test articles about various tech topics'

    def get_random_paragraphs(self, num_paragraphs=3):
        paragraphs = [
            "In the ever-evolving landscape of technology, understanding the fundamentals of data structures and algorithms remains crucial. These building blocks form the foundation of efficient software development, enabling developers to create scalable and performant applications.",
            
            "Modern web development frameworks have revolutionized how we build applications. From React's component-based architecture to Django's batteries-included philosophy, developers now have powerful tools at their disposal.",
            
            "Cloud computing has transformed the way we deploy and scale applications. Services like AWS, Azure, and Google Cloud Platform provide robust infrastructure that can adapt to varying workloads.",
            
            "The rise of artificial intelligence and machine learning has opened new possibilities in software development. From natural language processing to computer vision, AI is becoming an integral part of modern applications.",
            
            "Security considerations in software development cannot be overlooked. Best practices include input validation, proper authentication mechanisms, and regular security audits.",
            
            "Database optimization plays a crucial role in application performance. Understanding indexing strategies, query optimization, and caching mechanisms can significantly improve response times.",
            
            "Containerization technologies like Docker have simplified application deployment and environment consistency. Kubernetes extends this further by providing robust orchestration capabilities.",
            
            "Test-driven development (TDD) has become a standard practice in many development teams. Writing tests first helps ensure code quality and maintainability.",
            
            "The JavaScript ecosystem continues to grow with new tools and frameworks. Understanding core concepts like promises, async/await, and state management is essential.",
            
            "Python's simplicity and extensive library ecosystem make it a popular choice for various applications. From web development to data science, Python provides powerful tools.",
        ]
        return "\n\n".join(random.sample(paragraphs, num_paragraphs))

    def handle(self, *args, **kwargs):
        topics = [
            ("Understanding Database Indexing", "Database Expert"),
            ("Modern JavaScript Features", "Frontend Developer"),
            ("Python Best Practices", "Python Developer"),
            ("React Component Patterns", "React Developer"),
            ("API Security Guidelines", "Security Engineer"),
            ("Cloud Deployment Strategies", "DevOps Engineer"),
            ("Machine Learning Basics", "AI Researcher"),
            ("Web Performance Optimization", "Performance Engineer"),
            ("Docker Container Management", "DevOps Specialist"),
            ("GraphQL vs REST", "Backend Developer"),
        ]

        for i in range(55):
            topic, author = random.choice(topics)
            title = f"{topic} - Part {(i // 10) + 1}"
            
            article = Article.objects.create(
                title=title,
                content=self.get_random_paragraphs(random.randint(3, 5)),
                author=author,
                published_date=timezone.now() - timedelta(days=i),
                source_url=f'https://example.com/articles/{i+1}'
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created article: {title}')
            ) 