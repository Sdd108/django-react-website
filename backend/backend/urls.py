'''
Author: “Zhipeng “zhipengmail@qq.com”
Date: 2024-12-19 16:53:58
LastEditors: “Zhipeng “zhipengmail@qq.com”
LastEditTime: 2024-12-19 17:11:11
FilePath: /django-react-website/backend/backend/urls.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.http import JsonResponse

# Option 1: Create a simple view for root URL
def index(request):
    return JsonResponse({
        "message": "Welcome to the API",
        "endpoints": {
            "articles": "/api/articles/",
            "admin": "/admin/",
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Choose one of these options:
    path('', index),  # Option 1: Show API information
    # path('', RedirectView.as_view(url='/api/')),  # Option 2: Redirect to API
] 