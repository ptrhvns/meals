from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from recipes import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("recipe/<int:recipe_id>/", views.recipe),
    path("recipe/<int:recipe_id>/destroy/", views.recipe_destroy),
    path("recipe/<int:recipe_id>/tag/<int:tag_id>/dissociate/", views.tag_dissociate),
    path("recipe/<int:recipe_id>/tag/associate/", views.tag_associate),
    path("recipe/<int:recipe_id>/title/update/", views.recipe_title_update),
    path("recipe/create/", views.recipe_create),
    path("recipes/", views.recipes),
    path("tag/<int:tag_id>/", views.tag),
    path("tag/<int:tag_id>/update/", views.tag_update),
    path("tag/create/", views.tag_create),
    path("tags/", views.tags),
]
