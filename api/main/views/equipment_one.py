from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.equipment import Equipment


class EquipmentOneResponseSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("description", "id")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def equipment_one(request: Request, equipment_id: int) -> Response:
    equipment = get_object_or_404(Equipment, pk=equipment_id, user=request.user)
    serializer = EquipmentOneResponseSerializer(equipment)
    return data_response(data={"equipmentOne": serializer.data})
