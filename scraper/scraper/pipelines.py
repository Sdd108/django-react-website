'''
Author: “Zhipeng “zhipengmail@qq.com”
Date: 2024-12-19 16:54:03
LastEditors: “Zhipeng “zhipengmail@qq.com”
LastEditTime: 2024-12-19 22:01:38
FilePath: /django-react-website/scraper/scraper/pipelines.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
import django
import os
import sys
from datetime import datetime

# Set up Django environment
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
django.setup()

from backend.articles.models import Article

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