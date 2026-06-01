from rest_framework import serializers
from articles.models import Article


class ArticleSerializer(serializers.ModelSerializer):
    last_updated = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        # 直接序列化 Article 模型，前端列表、详情和创建接口共用这一份字段定义。
        model = Article
        fields = [
            "id",
            "title",
            "content",
            "author",
            "published_date",
            "source_url",
            "created_at",
            "updated_at",
            "last_updated",
        ]
        # 这些字段由数据库或 Django 自动生成，客户端不应该在创建文章时覆盖。
        read_only_fields = ["id", "created_at", "updated_at", "last_updated"]
