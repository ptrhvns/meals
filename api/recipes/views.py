from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from recipes.models import Recipe
from recipes.serializers import (
    RecipeCreateRequestSerializer,
    RecipeCreateResponseSerializer,
    RecipeResponseSerializer,
    RecipeTitleUpdateRequestSerializer,
)
from shared.lib.responses import (
    data_response,
    invalid_request_data_response,
    no_content_response,
)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def recipe(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    data = RecipeResponseSerializer(recipe).data
    return data_response(data=data)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def recipe_create(request: Request) -> Response:
    serializer = RecipeCreateRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    recipe = serializer.save(user=request.user)
    data = RecipeCreateResponseSerializer(instance=recipe).data
    return data_response(data=data)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def recipe_title_update(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = RecipeTitleUpdateRequestSerializer(data=request.data, instance=recipe)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    serializer.save()
    return no_content_response()
