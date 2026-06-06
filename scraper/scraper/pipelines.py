import django
import os
import sys
from datetime import datetime

# 将 backend 加入 import path，并初始化 Django settings，之后才能导入 ORM 模型。
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
django.setup()

from backend.articles.models import Article
from django.contrib.auth import get_user_model

class ScraperPipeline:
    def process_item(self, item, spider):
        User = get_user_model()
        owner, created = User.objects.get_or_create(
            username="scraper",
            defaults={"email": "scraper@example.com"},
        )
        if created:
            owner.set_unusable_password()
            owner.save(update_fields=["password"])

        # spider 产出的 item 字段名与 Article 模型保持一致，pipeline 只做日期转换和持久化。
        article = Article(
            author_user=owner,
            title=item['title'],
            content=item['content'],
            author=item['author'],
            # 目标站点日期字符串约定为 YYYY-MM-DD，这里转换成 Django DateTimeField 可接受的值。
            published_date=datetime.strptime(item['published_date'], '%Y-%m-%d'),
            source_url=item['source_url']
        )
        article.save()
        # 返回 item 让后续 pipeline 或 Scrapy 统计仍能继续处理。
        return item
