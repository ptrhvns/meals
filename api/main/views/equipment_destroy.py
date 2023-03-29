from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.equipment import Equipment


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def equipment_destroy(request: Request, equipment_id: int) -> Response:
    equipment = get_object_or_404(Equipment, pk=equipment_id, user=request.user)
    equipment.delete()
    return no_content_response()
