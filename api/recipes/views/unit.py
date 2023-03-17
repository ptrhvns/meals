from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Unit
from shared.lib.responses import data_response


class UnitResponseSerializer(ModelSerializer):
    class Meta:
        model = Unit
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def unit(request: Request, unit_id: int) -> Response:
    unit = get_object_or_404(Unit, pk=unit_id, user=request.user)
    serializer = UnitResponseSerializer(unit)
    return data_response(data={"unit": serializer.data})
