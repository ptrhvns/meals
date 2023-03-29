from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.brand import Brand


class BrandResponseSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def brand(request: Request, brand_id: int) -> Response:
    brand = get_object_or_404(Brand, pk=brand_id, user=request.user)
    serializer = BrandResponseSerializer(brand)
    return data_response(data={"brand": serializer.data})
