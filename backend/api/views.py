from django.db.models import Q
from rest_framework import mixins, permissions, viewsets
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


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            wants_own_articles = (
                request.query_params.get("my_articles", "").lower() == "true"
            )
            return not wants_own_articles or request.user.is_authenticated
        return request.user and request.user.is_authenticated


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author_user == request.user


class ArticleViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.ReadOnlyModelViewSet,
):
    # 组合 CRUD 需要的 mixin：开放创建、编辑、删除、列表和详情。
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination
    # 置顶文章优先，其余按发布时间倒序排列。
    queryset = Article.objects.all().order_by("-is_pinned", "-published_date")
    serializer_class = ArticleSerializer
    # 同时支持精确过滤和全文搜索，给文章列表页或未来搜索框复用。
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["author", "title", "author_user__username", "is_published"]
    search_fields = ["title", "content", "author"]

    def get_queryset(self):
        qs = super().get_queryset()
        wants_own_articles = (
            self.request.query_params.get("my_articles", "").lower() == "true"
        )

        if wants_own_articles and self.request.user.is_authenticated:
            return qs.filter(author_user=self.request.user)

        if self.request.user.is_authenticated:
            return qs.filter(Q(is_published=True) | Q(author_user=self.request.user))

        return qs.filter(is_published=True)

    def perform_create(self, serializer):
        serializer.save(author_user=self.request.user)
