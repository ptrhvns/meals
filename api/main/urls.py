from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from main.views.account_destroy import account_destroy
from main.views.brand import brand
from main.views.brand_create import brand_create
from main.views.brand_destroy import brand_destroy
from main.views.brand_recipes import brand_recipes
from main.views.brand_update import brand_update
from main.views.brands import brands
from main.views.csrf_token import csrf_token
from main.views.direction import direction
from main.views.direction_create import direction_create
from main.views.direction_destroy import direction_destroy
from main.views.direction_update import direction_update
from main.views.directions_reorder import directions_reorder
from main.views.equipment_create import equipment_create
from main.views.equipment_destroy import equipment_destroy
from main.views.equipment_link import equipment_link
from main.views.equipment_many import equipment_many
from main.views.equipment_one import equipment_one
from main.views.equipment_recipes import equipment_recipes
from main.views.equipment_unlink import equipment_unlink
from main.views.equipment_update import equipment_update
from main.views.food_create import food_create
from main.views.food_destroy import food_destroy
from main.views.food_many import food_many
from main.views.food_one import food_one
from main.views.food_recipes import food_recipes
from main.views.food_update import food_update
from main.views.ingredient import ingredient
from main.views.ingredient_create import ingredient_create
from main.views.ingredient_destroy import ingredient_destroy
from main.views.ingredient_update import ingredient_update
from main.views.ingredients_reorder import ingredients_reorder
from main.views.login import login
from main.views.logout import logout
from main.views.notes_destroy import notes_destroy
from main.views.notes_update import notes_update
from main.views.rating import rating
from main.views.rating_destroy import rating_destroy
from main.views.rating_update import rating_update
from main.views.recipe import recipe
from main.views.recipe_create import recipe_create
from main.views.recipe_destroy import recipe_destroy
from main.views.recipe_title_update import recipe_title_update
from main.views.recipes import recipes
from main.views.servings_destroy import servings_destroy
from main.views.servings_update import servings_update
from main.views.signup_confirmation_update import signup_confirmation_update
from main.views.signup_create import signup_create
from main.views.tag import tag
from main.views.tag_create import tag_create
from main.views.tag_destroy import tag_destroy
from main.views.tag_link import tag_link
from main.views.tag_recipes import tag_recipes
from main.views.tag_unlink import tag_unlink
from main.views.tag_update import tag_update
from main.views.tags import tags
from main.views.time import time
from main.views.time_categories import time_categories
from main.views.time_category import time_category
from main.views.time_category_create import time_category_create
from main.views.time_category_destroy import time_category_destroy
from main.views.time_category_recipes import time_category_recipes
from main.views.time_category_update import time_category_update
from main.views.time_create import time_create
from main.views.time_destroy import time_destroy
from main.views.time_update import time_update
from main.views.unit import unit
from main.views.unit_create import unit_create
from main.views.unit_destroy import unit_destroy
from main.views.unit_recipes import unit_recipes
from main.views.unit_update import unit_update
from main.views.units import units

# fmt: off
urlpatterns: list[URLPattern | URLResolver] = [
    path("account/destroy/", account_destroy, name="account_destroy"),
    path("brand/<int:brand_id>/", brand, name="brand"),
    path("brand/<int:brand_id>/destroy/", brand_destroy, name="brand_destroy"),
    path("brand/<int:brand_id>/recipes/", brand_recipes, name="brand_recipes"),
    path("brand/<int:brand_id>/update/", brand_update, name="brand_update"),
    path("brand/create/", brand_create, name="brand_create"),
    path("brands/", brands, name="brands"),
    path("csrf_token/", csrf_token, name="csrf_token"),
    path("direction/<int:direction_id>/", direction, name="direction"),
    path("direction/<int:direction_id>/destroy/", direction_destroy, name="direction_destroy"),
    path("direction/<int:direction_id>/update/", direction_update, name="direction_update"),
    path("directions/reorder/", directions_reorder, name="directions_reorder"),
    path("equipment-many/", equipment_many, name="equipment_many"),
    path("equipment-one/<int:equipment_id>/", equipment_one),
    path("equipment/<int:equipment_id>/destroy/", equipment_destroy, name="equipment_destroy"),
    path("equipment/<int:equipment_id>/recipes/", equipment_recipes),
    path("equipment/<int:equipment_id>/update/", equipment_update),
    path("equipment/create/", equipment_create, name="equipment_create"),
    path("food-many/", food_many),
    path("food-one/<int:food_id>/", food_one),
    path("food/<int:food_id>/destroy/", food_destroy),
    path("food/<int:food_id>/recipes/", food_recipes),
    path("food/<int:food_id>/update/", food_update),
    path("food/create/", food_create),
    path("ingredient/<int:ingredient_id>/", ingredient),
    path("ingredient/<int:ingredient_id>/destroy/", ingredient_destroy),
    path("ingredient/<int:ingredient_id>/update/", ingredient_update),
    path("ingredients/reorder/", ingredients_reorder),
    path("login/", login),
    path("logout/", logout),
    path("rating/<int:recipe_id>/", rating),
    path("rating/<int:recipe_id>/update/", rating_update),
    path("recipe/<int:recipe_id>/", recipe),
    path("recipe/<int:recipe_id>/destroy/", recipe_destroy),
    path("recipe/<int:recipe_id>/direction/create/", direction_create, name="direction_create"),
    path("recipe/<int:recipe_id>/equipment/<int:equipment_id>/unlink/", equipment_unlink),
    path("recipe/<int:recipe_id>/equipment/link/", equipment_link, name="equipment_link"),
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
    path("signup/create/", signup_create),
    path("signup_confirmation/update/", signup_confirmation_update),
    path("tag/<int:tag_id>/", tag),
    path("tag/<int:tag_id>/destroy/", tag_destroy),
    path("tag/<int:tag_id>/recipes/", tag_recipes),
    path("tag/<int:tag_id>/update/", tag_update),
    path("tag/create/", tag_create),
    path("tags/", tags),
    path("time-categories/", time_categories),
    path("time-category/<int:time_category_id>/", time_category),
    path("time-category/<int:time_category_id>/destroy/", time_category_destroy),
    path("time-category/<int:time_category_id>/recipes/", time_category_recipes),
    path("time-category/<int:time_category_id>/update/", time_category_update),
    path("time-category/create/", time_category_create),
    path("time/<int:time_id>/destroy/", time_destroy),
    path("unit/<int:unit_id>/", unit),
    path("unit/<int:unit_id>/destroy/", unit_destroy),
    path("unit/<int:unit_id>/recipes/", unit_recipes),
    path("unit/<int:unit_id>/update/", unit_update),
    path("unit/create/", unit_create),
    path("units/", units),
]
