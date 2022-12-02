from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from shared import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("csrf_token/", views.csrf_token),
]
