from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Equipment, Recipe
from shared.lib.responses import data_response


class EquipmentRecipesResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def equipment_recipes(request: Request, equipment_id: int) -> Response:
    equipment = get_object_or_404(Equipment, pk=equipment_id, user=request.user)
    paginator = Paginator(equipment.recipes.order_by("title").all(), per_page=10)
    page = paginator.get_page(request.query_params.get("page", 1))
    serializer = EquipmentRecipesResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "recipes": serializer.data,
        }
    )
