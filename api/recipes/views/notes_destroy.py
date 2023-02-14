from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from recipes.models import Recipe
from shared.lib.responses import no_content_response


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def notes_destroy(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    recipe.notes = ""
    recipe.save()
    return no_content_response()
