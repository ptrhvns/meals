from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from recipes.models import Unit
from shared.lib.responses import no_content_response


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def unit_destroy(request: Request, unit_id: int) -> Response:
    unit = get_object_or_404(Unit, pk=unit_id, user=request.user)
    unit.delete()
    return no_content_response()
