"""
WSGI 部署入口。

传统同步 WSGI 服务器（如 Gunicorn/uWSGI）会导入这里的 application 对象。
本地 manage.py runserver 也会通过同一套 Django settings 初始化应用。
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# 模块级 application 是 WSGI 服务器约定读取的入口变量。
application = get_wsgi_application()
