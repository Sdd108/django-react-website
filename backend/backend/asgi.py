"""
ASGI 部署入口。

异步服务器（如 Daphne/Uvicorn）会导入这里的 application 对象。
当前项目没有自定义异步协议处理，因此直接使用 Django 默认 ASGI 应用。
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# 模块级 application 是 ASGI 服务器约定读取的入口变量。
application = get_asgi_application()
