from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published_date', 'created_at')
    list_filter = ('author', 'published_date')
    search_fields = ('title', 'content', 'author')
    date_hierarchy = 'published_date'
    ordering = ('-published_date',)
