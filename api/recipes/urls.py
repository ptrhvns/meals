from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from recipes.views.equipment import equipment
from recipes.views.equipment_link import equipment_link
from recipes.views.equipment_unlink import equipment_unlink
from recipes.views.notes_destroy import notes_destroy
from recipes.views.notes_update import notes_update
from recipes.views.rating import rating
from recipes.views.rating_destroy import rating_destroy
from recipes.views.rating_update import rating_update
from recipes.views.recipe import recipe
from recipes.views.recipe_create import recipe_create
from recipes.views.recipe_destroy import recipe_destroy
from recipes.views.recipe_title_update import recipe_title_update
from recipes.views.recipes import recipes
from recipes.views.servings_destroy import servings_destroy
from recipes.views.servings_update import servings_update
from recipes.views.tag import tag
from recipes.views.tag_create import tag_create
from recipes.views.tag_destroy import tag_destroy
from recipes.views.tag_link import tag_link
from recipes.views.tag_recipes import tag_recipes
from recipes.views.tag_unlink import tag_unlink
from recipes.views.tag_update import tag_update
from recipes.views.tags import tags
from recipes.views.time import time
from recipes.views.time_categories import time_categories
from recipes.views.time_create import time_create
from recipes.views.time_destroy import time_destroy
from recipes.views.time_update import time_update

# fmt: off
urlpatterns: list[URLPattern | URLResolver] = [
    path("equipment/", equipment),
    path("rating/<int:recipe_id>/", rating),
    path("rating/<int:recipe_id>/update/", rating_update),
    path("recipe/<int:recipe_id>/", recipe),
    path("recipe/<int:recipe_id>/destroy/", recipe_destroy),
    path("recipe/<int:recipe_id>/equipment/<int:equipment_id>/unlink/", equipment_unlink),
    path("recipe/<int:recipe_id>/equipment/link/", equipment_link),
    path("recipe/<int:recipe_id>/notes/destroy/", notes_destroy),
    path("recipe/<int:recipe_id>/notes/update/", notes_update),
    path("recipe/<int:recipe_id>/rating/destroy/", rating_destroy),
    path("recipe/<int:recipe_id>/servings/destroy/", servings_destroy),
    path("recipe/<int:recipe_id>/servings/update/", servings_update),
    path("recipe/<int:recipe_id>/tag/<int:tag_id>/unlink/", tag_unlink),
    path("recipe/<int:recipe_id>/tag/link/", tag_link),
    path("recipe/<int:recipe_id>/time/<int:time_id>/", time),
    path("recipe/<int:recipe_id>/time/<int:time_id>/update/", time_update),
    path("recipe/<int:recipe_id>/time/create/", time_create),
    path("recipe/<int:recipe_id>/title/update/", recipe_title_update),
    path("recipe/create/", recipe_create),
    path("recipes/", recipes),
    path("tag/<int:tag_id>/", tag),
    path("tag/<int:tag_id>/destroy/", tag_destroy),
    path("tag/<int:tag_id>/recipes/", tag_recipes),
    path("tag/<int:tag_id>/update/", tag_update),
    path("tag/create/", tag_create),
    path("tags/", tags),
    path("time/<int:time_id>/destroy/", time_destroy),
    path("time_categories/", time_categories),
]
