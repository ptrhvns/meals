from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.brand import Brand
from main.models.recipe import Recipe


class BrandRecipesResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def brand_recipes(request: Request, brand_id: int) -> Response:
    brand = get_object_or_404(Brand, pk=brand_id, user=request.user)
    ingredients = brand.ingredients.select_related("recipe")  # type: ignore[attr-defined]

    def key(r: Recipe) -> str:
        return r.title.lower()

    recipes = sorted({i.recipe for i in ingredients}, key=key)
    paginator = Paginator(recipes, per_page=10)
    page = paginator.get_page(request.query_params.get("page", 1))
    serializer = BrandRecipesResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "recipes": serializer.data,
        }
    )
