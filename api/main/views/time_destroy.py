from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.time import Time


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def time_destroy(request: Request, time_id: int) -> Response:
    time = get_object_or_404(Time, pk=time_id, recipe__user=request.user)
    time.delete()
    return no_content_response()
