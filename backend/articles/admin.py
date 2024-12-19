'''
Author: “Zhipeng “zhipengmail@qq.com”
Date: 2024-12-19 17:07:08
LastEditors: “Zhipeng “zhipengmail@qq.com”
LastEditTime: 2024-12-19 17:24:26
FilePath: /django-react-website/backend/articles/admin.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published_date', 'created_at')
    list_filter = ('author', 'published_date')
    search_fields = ('title', 'content', 'author')
    date_hierarchy = 'published_date'
    ordering = ('-published_date',)
