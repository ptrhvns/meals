from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from recipes.views.brand import brand
from recipes.views.brand_create import brand_create
from recipes.views.brand_destroy import brand_destroy
from recipes.views.brand_update import brand_update
from recipes.views.brands import brands
from recipes.views.equipment_create import equipment_create
from recipes.views.equipment_destroy import equipment_destroy
from recipes.views.equipment_link import equipment_link
from recipes.views.equipment_many import equipment_many
from recipes.views.equipment_one import equipment_one
from recipes.views.equipment_recipes import equipment_recipes
from recipes.views.equipment_unlink import equipment_unlink
from recipes.views.equipment_update import equipment_update
from recipes.views.food_create import food_create
from recipes.views.food_many import food_many
from recipes.views.ingredient import ingredient
from recipes.views.ingredient_create import ingredient_create
from recipes.views.ingredient_destroy import ingredient_destroy
from recipes.views.ingredient_update import ingredient_update
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
from recipes.views.units import units

# fmt: off
urlpatterns: list[URLPattern | URLResolver] = [
    path("brand/<int:brand_id>/", brand),
    path("brand/<int:brand_id>/destroy/", brand_destroy),
    path("brand/<int:brand_id>/update/", brand_update),
    path("brand/create/", brand_create),
    path("brands/", brands),
    path("equipment-many/", equipment_many),
    path("equipment-one/<int:equipment_id>/", equipment_one),
    path("equipment/<int:equipment_id>/destroy/", equipment_destroy),
    path("equipment/<int:equipment_id>/recipes/", equipment_recipes),
    path("equipment/<int:equipment_id>/update/", equipment_update),
    path("equipment/create/", equipment_create),
    path("food-many/", food_many),
    path("food/create/", food_create),
    path("ingredient/<int:ingredient_id>/", ingredient),
    path("ingredient/<int:ingredient_id>/destroy/", ingredient_destroy),
    path("ingredient/<int:ingredient_id>/update/", ingredient_update),
    path("rating/<int:recipe_id>/", rating),
    path("rating/<int:recipe_id>/update/", rating_update),
    path("recipe/<int:recipe_id>/", recipe),
    path("recipe/<int:recipe_id>/destroy/", recipe_destroy),
    path("recipe/<int:recipe_id>/equipment/<int:equipment_id>/unlink/", equipment_unlink),
    path("recipe/<int:recipe_id>/equipment/link/", equipment_link),
    path("recipe/<int:recipe_id>/ingredient/create/", ingredient_create),
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
    path("units/", units),
]
