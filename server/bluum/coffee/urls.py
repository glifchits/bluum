from django.urls import path

from . import views

urlpatterns = [
    path('', views.list_coffee, name="list_coffee")
]
