from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

router = DefaultRouter()
# 注册 articles 后，DRF 自动生成 /articles/ 和 /articles/{id}/ 等路由。
router.register(r"articles", ArticleViewSet)

# 这里不手写每个 URL，统一交给 router 输出 REST 风格路由。
urlpatterns = [
    path("", include(router.urls)),
]
