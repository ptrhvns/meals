from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import DecimalField, ModelSerializer

from main.lib.responses import invalid_request_data_response, no_content_response
from main.models.recipe import Recipe


class ServingsRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("servings",)

    servings = DecimalField(decimal_places=2, max_digits=6, min_value=0, required=True)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def servings_update(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = ServingsRequestSerializer(data=request.data, instance=recipe)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    serializer.save()
    return no_content_response()
