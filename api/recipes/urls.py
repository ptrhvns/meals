from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from recipes import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("rating/<int:recipe_id>/", views.rating),
    path("rating/<int:recipe_id>/destroy/", views.rating_destroy),
    path("rating/<int:recipe_id>/update/", views.rating_update),
    path("recipe/<int:recipe_id>/", views.recipe),
    path("recipe/<int:recipe_id>/destroy/", views.recipe_destroy),
    path("recipe/<int:recipe_id>/tag/<int:tag_id>/unlink/", views.tag_unlink),
    path("recipe/<int:recipe_id>/tag/link/", views.tag_link),
    path("recipe/<int:recipe_id>/title/update/", views.recipe_title_update),
    path("recipe/create/", views.recipe_create),
    path("recipes/", views.recipes),
    path("tag/<int:tag_id>/", views.tag),
    path("tag/<int:tag_id>/destroy/", views.tag_destroy),
    path("tag/<int:tag_id>/recipes/", views.tag_recipes),
    path("tag/<int:tag_id>/update/", views.tag_update),
    path("tag/create/", views.tag_create),
    path("tags/", views.tags),
]
