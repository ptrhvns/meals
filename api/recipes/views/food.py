from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Food
from shared.lib.responses import data_response


class FoodResponseSerializer(ModelSerializer):
    class Meta:
        model = Food
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def food(request: Request) -> Response:
    food = Food.objects.filter(user=request.user).order_by("name").all()
    serializer = FoodResponseSerializer(food, many=True)
    return data_response(data={"food": serializer.data})
