from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.recipe import Recipe
from main.models.tag import Tag


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_unlink(request: Request, recipe_id: int, tag_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    tag = get_object_or_404(Tag, pk=tag_id, recipes=recipe, user=request.user)
    recipe.tags.remove(tag)  # type: ignore[attr-defined]
    return no_content_response()
