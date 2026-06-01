import os
import sys
import django

def setup_django():
    # 从 scraper/src/utils 回到仓库根目录，再把 backend 加入 Python 模块搜索路径。
    sys.path.append(os.path.join(os.path.dirname(os.path.dirname(
        os.path.dirname(os.path.dirname(__file__)))), 'backend'))
    # Scrapy 进程不是由 manage.py 启动的，因此需要手动指定 Django settings。
    os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
    # 初始化应用注册表，之后 ORM 和模型导入才能正常工作。
    django.setup()
