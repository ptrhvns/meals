from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.recipe import Recipe


class RecipesResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def recipes(request: Request) -> Response:
    query = request.query_params.get("query")
    recipes = Recipe.objects.order_by("title")

    if not query:
        recipes = recipes.filter(user=request.user)
    else:
        recipes = recipes.filter(title__icontains=query, user=request.user)

    page_num = request.query_params.get("page")

    if page_num is None:
        serializer = RecipesResponseSerializer(recipes, many=True)
        return data_response(data={"recipes": serializer.data})

    paginator = Paginator(recipes, per_page=10)
    page = paginator.get_page(page_num)
    serializer = RecipesResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "recipes": serializer.data,
        }
    )
