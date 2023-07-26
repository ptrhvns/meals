from django.db import Error
from django.db.transaction import atomic
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, DecimalField, Serializer

from main.lib.responses import (
    created_response,
    invalid_request_data_response,
    unprocessable_entity_response,
)
from main.models.brand import Brand
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.recipe import Recipe
from main.models.unit import Unit


class IngredientCreateRequestSerializer(Serializer):
    amount = DecimalField(decimal_places=2, max_digits=5, required=False)
    brand = CharField(
        max_length=Brand._meta.get_field("name").max_length, required=False
    )
    food = CharField(max_length=Food._meta.get_field("name").max_length)
    note = CharField(
        max_length=Ingredient._meta.get_field("note").max_length, required=False
    )
    unit = CharField(max_length=Unit._meta.get_field("name").max_length, required=False)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def ingredient_create(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)

    # Eliminate fields with an empty string.
    pruned_data = {k: v for k, v in request.data.items() if v}

    serializer = IngredientCreateRequestSerializer(data=pruned_data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with atomic():
            ingredient_data = {}

            if "amount" in serializer.validated_data:
                ingredient_data["amount"] = serializer.validated_data["amount"]

            if "brand" in serializer.validated_data:
                ingredient_data["brand"] = Brand.objects.get_or_create(
                    defaults={"name": serializer.validated_data["brand"]},
                    name__iexact=serializer.validated_data["brand"],
                    user=request.user,
                )[0]

            ingredient_data["food"] = Food.objects.get_or_create(
                defaults={"name": serializer.validated_data["food"]},
                name__iexact=serializer.validated_data["food"],
                user=request.user,
            )[0]

            if "note" in serializer.validated_data:
                ingredient_data["note"] = serializer.validated_data.get("note")

            if "unit" in serializer.validated_data:
                ingredient_data["unit"] = Unit.objects.get_or_create(
                    defaults={"name": serializer.validated_data["unit"]},
                    name__iexact=serializer.validated_data["unit"],
                    user=request.user,
                )[0]

            order = Ingredient.objects.filter(recipe=recipe).count()
            Ingredient.objects.create(recipe=recipe, order=order, **ingredient_data)
    except Error:
        return unprocessable_entity_response(
            message=gettext_lazy("Your information could not be saved.")
        )

    return created_response()
