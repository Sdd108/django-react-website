from django.contrib import admin
from .models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    # 列表页展示最常用于识别和筛选文章的字段。
    list_display = (
        "title",
        "author",
        "author_user",
        "is_published",
        "is_pinned",
        "published_date",
        "created_at",
    )
    # 作者和发布日期是后台排查内容来源时最常用的筛选维度。
    list_filter = ("author", "author_user", "is_published", "is_pinned", "published_date")
    # 允许管理员按标题、正文和作者快速定位文章。
    search_fields = ("title", "content", "author", "author_user__username")
    # 侧边日期导航按文章发布日期分组，而不是按创建时间分组。
    date_hierarchy = "published_date"
    ordering = ("-published_date",)
