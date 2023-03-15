from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Food
from shared.lib.responses import (
    invalid_request_data_response,
    no_content_response,
    unprocessable_entity_response,
)


class FoodUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = Food
        fields = ("name",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def food_update(request: Request, food_id: int) -> Response:
    food = get_object_or_404(Food, pk=food_id, user=request.user)
    serializer = FoodUpdateRequestSerializer(instance=food, data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    if food.name == serializer.validated_data["name"]:
        return no_content_response()

    # Use this test instead of a validator for a better user experience.
    if Food.objects.filter(
        name=serializer.validated_data["name"], user=request.user
    ).exists():
        return unprocessable_entity_response(
            errors={"name": [_("This name is already taken.")]},
            message=_("The information you provided could not be saved."),
        )

    serializer.save()
    return no_content_response()
