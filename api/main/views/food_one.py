from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.food import Food


class FoodOneResponseSerializer(ModelSerializer):
    class Meta:
        model = Food
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def food_one(request: Request, food_id: int) -> Response:
    food = get_object_or_404(Food, pk=food_id, user=request.user)
    serializer = FoodOneResponseSerializer(food)
    return data_response(data={"foodOne": serializer.data})
