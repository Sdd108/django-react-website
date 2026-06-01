from datetime import datetime
from ..utils.django_setup import setup_django

# 初始化 Django 环境后，pipeline 才能安全导入并使用 Article 模型。
setup_django()

# Django setup 完成后再导入模型，避免 settings 尚未配置导致 AppRegistryNotReady。
from backend.articles.models import Article

class DjangoStoragePipeline:
    def process_item(self, item, spider):
        # 旧版 pipeline 与当前 pipeline 行为一致：把爬虫 item 转成 Article 记录。
        article = Article(
            title=item['title'],
            content=item['content'],
            author=item['author'],
            # 日期格式需要与 spider 抽取出的字符串保持一致。
            published_date=datetime.strptime(item['published_date'], '%Y-%m-%d'),
            source_url=item['source_url']
        )
        article.save()
        return item
