from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from articles.models import Article
from .serializers import ArticleSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = StandardResultsSetPagination
    queryset = Article.objects.all().order_by('-published_date')
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['author', 'title']
    search_fields = ['title', 'content', 'author']