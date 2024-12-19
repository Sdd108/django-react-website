from scrapy import Item, Field

class ArticleItem(Item):
    title = Field()
    content = Field()
    author = Field()
    published_date = Field()
    source_url = Field() 