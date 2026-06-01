import scrapy
from datetime import datetime
from scraper.items import ArticleItem

class ArticleSpider(scrapy.Spider):
    name = 'article_spider'
    # 起始 URL 是占位示例；接入真实站点时需要替换为文章列表页。
    start_urls = ['https://example.com/articles']

    def parse(self, response):
        # CSS 选择器依赖目标站点 DOM 结构，真实抓取前需要按页面结构调整。
        articles = response.css('article')
        
        for article in articles:
            item = ArticleItem()
            # 每个 article 节点被映射成统一 ArticleItem，交给 pipeline 写入后端数据库。
            item['title'] = article.css('h1::text').get()
            item['content'] = article.css('.content::text').get()
            item['author'] = article.css('.author::text').get()
            item['published_date'] = article.css('.date::text').get()
            # 记录来源 URL，后续可在文章详情页展示或用于去重排查。
            item['source_url'] = response.url
            yield item
