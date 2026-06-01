from django.apps import AppConfig


class ApiConfig(AppConfig):
    # api 应用本身不存业务模型，只承载序列化、视图和路由。
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
