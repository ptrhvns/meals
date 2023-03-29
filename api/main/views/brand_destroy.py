from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.brand import Brand


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def brand_destroy(request: Request, brand_id: int) -> Response:
    brand = get_object_or_404(Brand, pk=brand_id, user=request.user)
    brand.delete()
    return no_content_response()
