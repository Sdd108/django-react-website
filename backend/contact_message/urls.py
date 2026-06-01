from django.urls import path
from . import views

urlpatterns = [
    # 联系表单只需要创建消息，因此根路径只绑定 POST 处理函数。
    path("", views.create_message, name="create_message"),
]
