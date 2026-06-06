"""
Django 后端项目的集中配置文件。

这里把数据库、已安装应用、中间件、CORS 和 DRF 默认行为放在一起，
本地开发环境会优先使用环境变量覆盖敏感配置。
"""

import os
from datetime import timedelta
from pathlib import Path

# 项目根路径，后续数据库、静态文件等路径都基于它拼接。
BASE_DIR = Path(__file__).resolve().parent.parent

# 生产环境必须通过 DJANGO_SECRET_KEY 注入真实密钥；默认值只用于本地开发。
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-dev-only-change-me")

# 允许用 DJANGO_DEBUG=false/0/no 关闭调试模式，避免把开发配置带到生产。
DEBUG = os.environ.get("DJANGO_DEBUG", "True").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = []

# Django 内置应用、第三方 API 工具，以及项目自己的业务应用。
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "django_filters",
    "api",
    "articles",
    "users",
    "contact_message",
]

# CORS 中间件放在靠前位置，确保浏览器跨域请求先被正确处理。
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# 默认使用 SQLite，适合本地开发；部署时可在这里替换为 PostgreSQL 等数据库。
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Django 用户体系的密码强度校验规则，主要影响 admin/auth 相关功能。
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# 使用上海时区存储和展示时间，USE_TZ=True 会让数据库侧保存时区感知时间。
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Shanghai"
USE_I18N = True
USE_TZ = True

# Django 后台和静态资源访问前缀。
STATIC_URL = "static/"

# 新模型默认使用 BigAutoField，避免 ID 范围过小。
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

# 前端开发服务器白名单；Vite 代理 API 时通常会命中这些来源。
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
# 本地调试阶段放开所有来源；生产环境应关闭并只保留明确白名单。
CORS_ALLOW_ALL_ORIGINS = True

# 允许 REST API 常用方法，便于后续扩展增删改接口。
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

# 浏览器和 DRF 请求需要的常见头部。
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# DRF 全局默认行为：公开 API、分页、测试请求格式、过滤和搜索后端。
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
