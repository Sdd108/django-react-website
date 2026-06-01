#!/usr/bin/env python
"""Django 管理命令入口，用于启动服务、迁移数据库和运行测试。"""

import os
import sys


def main():
    """设置默认配置模块，然后把命令行参数交给 Django 执行。"""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # 这里保留明确错误提示，便于定位虚拟环境未激活或依赖未安装的问题。
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
