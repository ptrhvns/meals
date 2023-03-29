from typing import Any, cast

from django.db.transaction import atomic
from django.shortcuts import get_list_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import IntegerField, ListSerializer, ModelSerializer

from main.lib.responses import invalid_request_data_response, no_content_response
from main.models.ingredient import Ingredient


class IngredientsReorderListSerializer(ListSerializer):
    def update(
        self, instance: list[Ingredient], validated_data: Any
    ) -> list[Ingredient]:
        ingredients_mapping = {i.id: i for i in instance}  # type: ignore[attr-defined]
        data_mapping = {d["id"]: d for d in validated_data}
        result = []

        for ingredient_id, data in data_mapping.items():
            ingredient = ingredients_mapping[ingredient_id]

            result.append(
                cast(IngredientsReorderSerializer, self.child).update(
                    ingredient, {"order": data["order"]}
                )
            )

        return result


class IngredientsReorderSerializer(ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ("id", "order")
        list_serializer_class = IngredientsReorderListSerializer

    # Ensure the id field is specified here explicitly. This will ensure that
    # it's not marked as readonly. Such attributes are removed from
    # validated_data during updates, and we need the id field to be in
    # validated_data so that the list serializer update works correctly.
    id = IntegerField()  # noqa: A003


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def ingredients_reorder(request: Request) -> Response:
    request_ingredients = request.data["ingredients"]

    db_ingredients = get_list_or_404(
        Ingredient,
        pk__in=[ri["id"] for ri in request_ingredients],
        recipe__user=request.user,
    )

    serializer = IngredientsReorderSerializer(
        data=request_ingredients, instance=db_ingredients, many=True
    )

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    with atomic():
        serializer.save()

    return no_content_response()
