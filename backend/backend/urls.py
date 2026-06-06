from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.http import JsonResponse


# 根路径返回一个轻量 JSON，方便快速确认后端服务是否正常启动。
def index(request):
    return JsonResponse(
        {
            "message": "Welcome to the API",
            "endpoints": {
                "articles": "/api/articles/",
                "auth": "/api/auth/",
                "admin": "/admin/",
            },
        }
    )


urlpatterns = [
    # Django 管理后台入口，用于直接维护文章和联系消息。
    path("admin/", admin.site.urls),
    # 文章 API 由 DRF router 生成列表、详情和创建路由。
    path("api/", include("api.urls")),
    # 联系表单使用单独应用，只暴露创建消息接口。
    path("api/contact/", include("contact_message.urls")),
    # 用户注册、登录、token 刷新和当前用户信息接口。
    path("api/auth/", include("users.urls")),
    # 首页不渲染模板，只作为 API 健康检查和入口提示。
    path("", index, name="index"),
]
