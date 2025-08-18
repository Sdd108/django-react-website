from datetime import datetime
from ..utils.django_setup import setup_django

# Initialize Django
setup_django()

# Now we can import Django models
from backend.articles.models import Article

class DjangoStoragePipeline:
    def process_item(self, item, spider):
        article = Article(
            title=item['title'],
            content=item['content'],
            author=item['author'],
            published_date=datetime.strptime(item['published_date'], '%Y-%m-%d'),
            source_url=item['source_url']
        )
        article.save()
        return item
