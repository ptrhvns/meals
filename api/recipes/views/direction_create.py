from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Direction, Recipe
from shared.lib.responses import created_response, invalid_request_data_response


class DirectionRequestSerializer(ModelSerializer):
    class Meta:
        model = Direction
        fields = ("description",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def direction_create(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = DirectionRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    order = Direction.objects.filter(recipe=recipe).count()
    serializer.save(order=order, recipe=recipe)
    return created_response()
