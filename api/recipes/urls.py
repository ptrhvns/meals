from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from recipes import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("recipe/create", views.recipe_create),
]
