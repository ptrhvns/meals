from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.time import Time
from main.models.time_category import TimeCategory


class TimeCategoryResponseSerializer(ModelSerializer):
    class Meta:
        model = TimeCategory
        fields = ("id", "name")


class TimeResponseSerializer(ModelSerializer):
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


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def time(request: Request, recipe_id: int, time_id: int) -> Response:
    time = get_object_or_404(
        Time, pk=time_id, recipe__user=request.user, recipe_id=recipe_id
    )
    data = TimeResponseSerializer(instance=time).data
    return data_response(data={"time": data})
