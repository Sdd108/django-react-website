import scrapy
from datetime import datetime
from scraper.items import ArticleItem

class ArticleSpider(scrapy.Spider):
    name = 'article_spider'
    # Replace with the websites you want to scrape
    start_urls = ['https://example.com/articles']

    def parse(self, response):
        # Adjust the selectors according to the website structure
        articles = response.css('article')
        
        for article in articles:
            item = ArticleItem()
            item['title'] = article.css('h1::text').get()
            item['content'] = article.css('.content::text').get()
            item['author'] = article.css('.author::text').get()
            item['published_date'] = article.css('.date::text').get()
            item['source_url'] = response.url
            yield item 