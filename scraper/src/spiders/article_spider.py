from ..items.article_item import ArticleItem
from scrapy import Spider

class ArticleSpider(Spider):
    name = 'article_spider'
    start_urls = ['https://example.com/articles']
    # ... rest of your spider code ... 