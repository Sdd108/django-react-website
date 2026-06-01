from django.apps import AppConfig


class ArticlesConfig(AppConfig):
    # 保持和项目全局一致的主键类型，防止迁移生成不同的默认 ID 字段。
    default_auto_field = "django.db.models.BigAutoField"
    # Django 用这个名称注册 articles 应用。
    name = "articles"
