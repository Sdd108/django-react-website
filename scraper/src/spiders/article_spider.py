from scrapy import Spider
from ..items.article_item import ArticleItem

class ArticleSpider(Spider):
    name = 'articles'
    # ... rest of your spider code ... 