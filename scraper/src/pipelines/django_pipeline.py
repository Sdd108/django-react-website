'''
Author: “Zhipeng “zhipengmail@qq.com”
Date: 2024-12-19 22:00:57
LastEditors: “Zhipeng “zhipengmail@qq.com”
LastEditTime: 2024-12-19 22:03:52
FilePath: /django-react-website/scraper/src/pipelines/django_pipeline.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
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
