from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.recipe import Recipe
from main.models.time_category import TimeCategory


class TimeCategoryRecipesResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def time_category_recipes(request: Request, time_category_id: int) -> Response:
    time_category = get_object_or_404(
        TimeCategory, pk=time_category_id, user=request.user
    )

    paginator = Paginator(time_category.recipes.order_by("title").all(), per_page=10)
    page = paginator.get_page(request.query_params.get("page", 1))
    serializer = TimeCategoryRecipesResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "recipes": serializer.data,
        }
    )
