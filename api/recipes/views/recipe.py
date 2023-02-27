from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Equipment, Recipe, Tag, Time, TimeCategory
from shared.lib.responses import data_response


class EquipmentSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("description", "id")


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
        fields = ("equipment", "id", "notes", "rating", "servings", "tags", "times", "title")

    equipment = EquipmentSerializer(many=True, required=False)
    tags = TagResponseSerializer(many=True, required=False)
    times = TimeResponseSerializer(many=True, required=False)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def recipe(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    data = RecipeResponseSerializer(recipe).data
    return data_response(data=data)
