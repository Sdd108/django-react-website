from django.db import models


class Article(models.Model):
    # 文章核心展示字段，列表页和详情页都会直接读取这些数据。
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)
    # 使用显式发布时间，而不是 created_at，方便导入历史文章或手动指定排序。
    published_date = models.DateTimeField()
    # 来源链接可为空，支持原创文章或暂时没有外部来源的内容。
    source_url = models.URLField(blank=True)
    # 创建/更新时间由 Django 自动维护，作为审计和排序辅助信息。
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # 后台管理和 shell 调试时用标题代表文章对象。
        return self.title

    class Meta:
        # 默认让最新发布的文章排在前面，匹配前端文章列表展示。
        ordering = ["-published_date"]
