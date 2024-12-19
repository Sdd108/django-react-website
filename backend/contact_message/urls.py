'''
Author: “Zhipeng “zhipengmail@qq.com”
Date: 2024-12-19 19:39:13
LastEditors: “Zhipeng “zhipengmail@qq.com”
LastEditTime: 2024-12-19 20:02:22
FilePath: /django-react-website/backend/contact_message/urls.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_message, name='create_message'),
]
