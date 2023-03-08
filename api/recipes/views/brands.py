from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Brand
from shared.lib.responses import data_response


class BrandsResponseSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def brands(request: Request) -> Response:
    brands = Brand.objects.filter(user=request.user).order_by("name").all()
    serializer = BrandsResponseSerializer(brands, many=True)
    return data_response(data={"brands": serializer.data})
