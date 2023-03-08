from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Unit
from shared.lib.responses import data_response


class UnitsResponseSerializer(ModelSerializer):
    class Meta:
        model = Unit
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def units(request: Request) -> Response:
    units = Unit.objects.filter(user=request.user).order_by("name").all()
    serializer = UnitsResponseSerializer(units, many=True)
    return data_response(data={"units": serializer.data})
