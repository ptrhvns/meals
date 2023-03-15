from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from recipes.models import Food
from shared.lib.responses import no_content_response


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def food_destroy(request: Request, food_id: int) -> Response:
    food = get_object_or_404(Food, pk=food_id, user=request.user)
    food.delete()
    return no_content_response()
