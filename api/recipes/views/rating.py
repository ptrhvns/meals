from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Recipe
from shared.lib.responses import data_response


class RecipeResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("rating",)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def rating(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    data = RecipeResponseSerializer(instance=recipe).data
    return data_response(data={"rating": data})
