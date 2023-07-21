from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import invalid_request_data_response, no_content_response
from main.models.direction import Direction


class DirectionUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = Direction
        fields = ("description",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def direction_update(request: Request, direction_id: int) -> Response:
    direction = get_object_or_404(Direction, pk=direction_id, recipe__user=request.user)
    serializer = DirectionUpdateRequestSerializer(instance=direction, data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    serializer.save()
    return no_content_response()
