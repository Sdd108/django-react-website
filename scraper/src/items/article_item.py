from scrapy import Item, Field

class ArticleItem(Item):
    # Item 字段与 Django Article 模型字段对齐，降低 pipeline 映射复杂度。
    title = Field()
    content = Field()
    author = Field()
    published_date = Field()
    # 来源链接用于追踪文章抓取来源，也可以在前端文章详情中展示。
    source_url = Field()
