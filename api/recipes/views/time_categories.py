from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import TimeCategory
from shared.lib.responses import data_response


class TimeCategoryResponseSerializer(ModelSerializer):
    class Meta:
        model = TimeCategory
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def time_categories(request: Request) -> Response:
    time_categories = (
        TimeCategory.objects.filter(user=request.user).order_by("name").all()
    )
    serializer = TimeCategoryResponseSerializer(time_categories, many=True)
    return data_response(data={"timeCategories": serializer.data})
