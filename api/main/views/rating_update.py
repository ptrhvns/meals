from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import invalid_request_data_response, no_content_response
from main.models.recipe import Recipe


class RecipeRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("rating",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def rating_update(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = RecipeRequestSerializer(data=request.data, instance=recipe)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    serializer.save()
    return no_content_response()
