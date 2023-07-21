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
    internal_server_error_response,
    invalid_request_data_response,
    no_content_response,
)
from main.models.time import Time
from main.models.time_category import TimeCategory


class TimeCategoryRequestSerializer(ModelSerializer):
    class Meta:
        model = TimeCategory
        fields = ("name",)


class TimeUpdateRequestSerializer(ModelSerializer):
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


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def time_update(request: Request, recipe_id: int, time_id: int) -> Response:
    # Eliminate fields with an empty string.
    pruned_data = {k: v for k, v in request.data.items() if v}

    time = get_object_or_404(
        Time, pk=time_id, recipe__user=request.user, recipe_id=recipe_id
    )

    serializer = TimeUpdateRequestSerializer(instance=time, data=pruned_data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with atomic():
            time_category_data = serializer.validated_data.pop("time_category")

            time_category = (
                TimeCategory.objects.get_or_create(
                    defaults={"user": request.user, **time_category_data},
                    name__iexact=time_category_data["name"],
                    user=request.user,
                )
            )[0]

            serializer.save(time_category=time_category)
    except Error:
        return internal_server_error_response(
            message=gettext_lazy("Your information could not be saved.")
        )

    return no_content_response()
