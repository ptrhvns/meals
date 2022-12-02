from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from accounts import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("signup/", views.signup),
]
