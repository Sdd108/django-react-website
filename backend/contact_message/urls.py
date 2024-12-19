from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_message, name='create_message'),
] 