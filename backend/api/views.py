from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from articles.models import Article
from .serializers import ArticleSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ArticleViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
    queryset = Article.objects.all().order_by('-published_date')
    serializer_class = ArticleSerializer 