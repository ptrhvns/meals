from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.direction import Direction


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def direction_destroy(request: Request, direction_id: int) -> Response:
    direction = get_object_or_404(Direction, pk=direction_id, recipe__user=request.user)
    direction.delete()
    return no_content_response()
