from rest_framework import mixins, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from articles.models import Article
from .serializers import ArticleSerializer


class StandardResultsSetPagination(PageNumberPagination):
    # 默认每页 10 条，前端列表页按这个结构读取 results/count/next/previous。
    page_size = 10
    # 允许客户端通过 page_size 调整数量，但仍受 max_page_size 限制。
    page_size_query_param = "page_size"
    max_page_size = 100


class ArticleViewSet(mixins.CreateModelMixin, viewsets.ReadOnlyModelViewSet):
    # 组合 CreateModelMixin 和 ReadOnlyModelViewSet：开放创建、列表、详情，避免默认暴露更新和删除。
    pagination_class = StandardResultsSetPagination
    # 明确按发布时间倒序排列，和模型 Meta 保持一致，也让接口行为更直观。
    queryset = Article.objects.all().order_by("-published_date")
    serializer_class = ArticleSerializer
    # 同时支持精确过滤和全文搜索，给文章列表页或未来搜索框复用。
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["author", "title"]
    search_fields = ["title", "content", "author"]
