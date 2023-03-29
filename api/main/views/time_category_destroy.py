from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.time_category import TimeCategory


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def time_category_destroy(request: Request, time_category_id: int) -> Response:
    time_category = get_object_or_404(
        TimeCategory, pk=time_category_id, user=request.user
    )
    time_category.delete()
    return no_content_response()
