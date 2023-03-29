from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.time_category import TimeCategory


class TimeCategoryResponseSerializer(ModelSerializer):
    class Meta:
        model = TimeCategory
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def time_category(request: Request, time_category_id: int) -> Response:
    time_category = get_object_or_404(
        TimeCategory, pk=time_category_id, user=request.user
    )
    serializer = TimeCategoryResponseSerializer(time_category)
    return data_response(data={"timeCategory": serializer.data})
