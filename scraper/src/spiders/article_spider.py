from ..items.article_item import ArticleItem
from scrapy import Spider

class ArticleSpider(Spider):
    # src 目录保留了早期 scaffold；当前活跃爬虫位于 scraper/scraper/spiders。
    name = 'article_spider'
    start_urls = ['https://example.com/articles']
    # 这里保留占位结构，方便以后迁移或对比旧版爬虫实现。
