from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)

# The API URLs are determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),  # This will include the root API view
] 