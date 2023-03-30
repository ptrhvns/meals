from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.direction import Direction


class DirectionResponseSerializer(ModelSerializer):
    class Meta:
        model = Direction
        fields = ("description", "id")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def direction(request: Request, direction_id: int) -> Response:
    direction = get_object_or_404(Direction, pk=direction_id, recipe__user=request.user)
    serializer = DirectionResponseSerializer(direction)
    return data_response(data={"direction": serializer.data})
