from django.core.paginator import Paginator
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
        fields = ("id", "title")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def recipes(request: Request) -> Response:
    recipes = Recipe.objects.filter(user=request.user).order_by("title").all()
    paginator = Paginator(recipes, per_page=10)
    page = paginator.get_page(request.query_params.get("page", 1))
    serializer = RecipeResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "recipes": serializer.data,
        }
    )
