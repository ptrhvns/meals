from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.ingredient import Ingredient


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def ingredient_destroy(request: Request, ingredient_id: int) -> Response:
    ingredient = get_object_or_404(
        Ingredient, pk=ingredient_id, recipe__user=request.user
    )
    ingredient.delete()
    return no_content_response()
