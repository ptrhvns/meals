from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.brand import Brand
from main.models.direction import Direction
from main.models.equipment import Equipment
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.recipe import Recipe
from main.models.tag import Tag
from main.models.time import Time
from main.models.time_category import TimeCategory
from main.models.unit import Unit


class DirectionsResponseSerializer(ModelSerializer):
    class Meta:
        model = Direction
        fields = ("description", "id", "order")


class EquipmentResponseSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("description", "id")


class BrandResponseSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name")


class FoodResponseSerializer(ModelSerializer):
    class Meta:
        model = Food
        fields = ("id", "name")


class UnitResponseSerializer(ModelSerializer):
    class Meta:
        model = Unit
        fields = ("id", "name")


class IngredientResponseSerializer(ModelSerializer):
    class Meta:
        model = Ingredient
        fields = (
            "amount",
            "brand",
            "food",
            "id",
            "note",
            "order",
            "unit",
        )

    brand = BrandResponseSerializer()
    food = FoodResponseSerializer()
    unit = UnitResponseSerializer()


class TagResponseSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class TimeCategoryResponseSerializer(ModelSerializer):
    class Meta:
        model = TimeCategory
        fields = ("id", "name")


class TimeResponseSerializer(ModelSerializer):
    class Meta:
        model = Time
        fields = ("days", "hours", "id", "minutes", "note", "time_category")

    time_category = TimeCategoryResponseSerializer()


class RecipeResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            "directions",
            "equipment",
            "id",
            "ingredients",
            "notes",
            "rating",
            "servings",
            "tags",
            "times",
            "title",
        )

    directions = DirectionsResponseSerializer(many=True)
    equipment = EquipmentResponseSerializer(many=True)
    ingredients = IngredientResponseSerializer(many=True)
    tags = TagResponseSerializer(many=True)
    times = TimeResponseSerializer(many=True)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def recipe(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    data = RecipeResponseSerializer(recipe).data
    return data_response(data={"recipe": data})
