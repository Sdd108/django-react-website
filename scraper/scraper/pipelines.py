import django
import os
import sys
from datetime import datetime

# Set up Django environment
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
django.setup()

from articles.models import Article

class ScraperPipeline:
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