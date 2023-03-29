from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.brand import Brand
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.unit import Unit


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
        fields = ("amount", "brand", "food", "id", "order", "unit")

    brand = BrandResponseSerializer(required=False)
    food = FoodResponseSerializer()
    unit = UnitResponseSerializer(required=False)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def ingredient(request: Request, ingredient_id: int) -> Response:
    ingredient = get_object_or_404(
        Ingredient, pk=ingredient_id, recipe__user=request.user
    )
    data = IngredientResponseSerializer(instance=ingredient).data
    return data_response(data={"ingredient": data})
