'''
Author: “Zhipeng “zhipengmail@qq.com”
Date: 2024-12-19 16:54:01
LastEditors: “Zhipeng “zhipengmail@qq.com”
LastEditTime: 2024-12-19 22:06:56
FilePath: /django-react-website/scraper/scraper/spiders/article_spider.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
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
