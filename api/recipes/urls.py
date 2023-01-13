from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from recipes import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("recipe/<int:recipe_id>/", views.recipe),
    path("recipe/<int:recipe_id>/tag/associate/", views.tag_associate),
    path("recipe/<int:recipe_id>/title/update/", views.recipe_title_update),
    path("recipe/create/", views.recipe_create),
    path("recipes/", views.recipes),
    path("tags/", views.tags),
]
