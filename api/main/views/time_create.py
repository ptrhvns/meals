from typing import Any

from django.db import Error
from django.db.transaction import atomic
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer, ValidationError

from main.lib.responses import (
    created_response,
    internal_server_error_response,
    invalid_request_data_response,
)
from main.models.recipe import Recipe
from main.models.time import Time
from main.models.time_category import TimeCategory


class TimeCategoryRequestSerializer(ModelSerializer):
    class Meta:
        model = TimeCategory
        fields = ("name",)


class TimeCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = Time
        fields = (
            "days",
            "hours",
            "minutes",
            "note",
            "time_category",
        )

    time_category = TimeCategoryRequestSerializer()

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        units = ["days", "hours", "minutes"]
        error = gettext_lazy("At least one unit is required.")

        if not any(data.get(u) for u in units):
            raise ValidationError({u: error for u in units})

        return data


class TimeCategoryResponseSerializer(ModelSerializer):
    class Meta:
        model = TimeCategory
        fields = ("id", "name")


class TimeCreateResponseSerializer(ModelSerializer):
    class Meta:
        model = Time
        fields = (
            "days",
            "hours",
            "id",
            "minutes",
            "note",
            "time_category",
        )

    time_category = TimeCategoryResponseSerializer()


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def time_create(request: Request, recipe_id: int) -> Response:
    # Eliminate fields with an empty string.
    pruned_data = {k: v for k, v in request.data.items() if v}

    serializer = TimeCreateRequestSerializer(data=pruned_data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)

    try:
        with atomic():
            time_category = (
                TimeCategory.objects.get_or_create(
                    defaults={
                        "user": request.user,
                        **serializer.validated_data["time_category"],
                    },
                    name__iexact=serializer.validated_data["time_category"]["name"],
                    user=request.user,
                )
            )[0]

            time_data = {
                k: v
                for (k, v) in serializer.validated_data.items()
                if k != "time_category"
            }

            time = Time(**time_data, recipe=recipe, time_category=time_category)
            time.save()
    except Error:
        return internal_server_error_response(
            message=gettext_lazy("Your information could not be saved.")
        )

    return created_response()
