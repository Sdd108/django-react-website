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
    path('api/contact/', include('contact_message.urls')),
    path('', index),
] 