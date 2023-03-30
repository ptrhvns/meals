from django import shortcuts
from django.db import Error, transaction
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, DecimalField, Serializer

from main.lib.responses import (
    invalid_request_data_response,
    no_content_response,
    unprocessable_entity_response,
)
from main.models.brand import Brand
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.unit import Unit


class IngredientUpdateSerializer(Serializer):
    amount = DecimalField(decimal_places=2, max_digits=5, required=False)
    brand = CharField(
        max_length=Brand._meta.get_field("name").max_length,
        required=False,
    )
    food = CharField(max_length=Food._meta.get_field("name").max_length)
    unit = CharField(
        max_length=Unit._meta.get_field("name").max_length,
        required=False,
    )


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def ingredient_update(request: Request, ingredient_id: int) -> Response:
    ingredient = shortcuts.get_object_or_404(
        Ingredient, pk=ingredient_id, recipe__user=request.user
    )

    # Eliminate fields with an empty string.
    pruned_data = {k: v for k, v in request.data.items() if v}

    serializer = IngredientUpdateSerializer(data=pruned_data, instance=ingredient)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with transaction.atomic():
            ingredient.amount = serializer.validated_data.get("amount")

            if "unit" in serializer.validated_data:
                ingredient.unit = Unit.objects.get_or_create(
                    defaults={"name": serializer.validated_data["unit"]},
                    name__iexact=serializer.validated_data["unit"],
                    user=request.user,
                )[0]
            else:
                ingredient.unit = None

            if "brand" in serializer.validated_data:
                ingredient.brand = Brand.objects.get_or_create(
                    defaults={"name": serializer.validated_data["brand"]},
                    name__iexact=serializer.validated_data["brand"],
                    user=request.user,
                )[0]
            else:
                ingredient.brand = None

            ingredient.food = Food.objects.get_or_create(
                defaults={"name": serializer.validated_data["food"]},
                name__iexact=serializer.validated_data["food"],
                user=request.user,
            )[0]

            ingredient.save()
    except Error:
        return unprocessable_entity_response(
            message=gettext_lazy("Your information could not be saved.")
        )

    return no_content_response()
