from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import created_response, invalid_request_data_response
from main.models.recipe import Recipe


class RecipeCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)


class RecipeCreateResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def recipe_create(request: Request) -> Response:
    serializer = RecipeCreateRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    recipe = serializer.save(user=request.user)
    data = RecipeCreateResponseSerializer(instance=recipe).data
    return created_response(data={"recipe": data})
