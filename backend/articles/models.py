'''
Author: “Zhipeng “zhipengmail@qq.com”
Date: 2024-12-19 16:53:56
LastEditors: “Zhipeng “zhipengmail@qq.com”
LastEditTime: 2024-12-20 09:27:30
FilePath: /django-react-website/backend/articles/models.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)
    published_date = models.DateTimeField()
    source_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-published_date'] 