from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Equipment
from shared.lib.responses import (
    invalid_request_data_response,
    no_content_response,
    unprocessable_entity_response,
)


class EquipmentRequestSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("description",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def equipment_update(request: Request, equipment_id: int) -> Response:
    equipment = get_object_or_404(Equipment, pk=equipment_id, user=request.user)
    serializer = EquipmentRequestSerializer(instance=equipment, data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    if equipment.description == serializer.validated_data["description"]:
        return no_content_response()

    # Use this test instead of a validator for a better user experience.
    if Equipment.objects.filter(
        description=serializer.validated_data["description"], user=request.user
    ).exists():
        return unprocessable_entity_response(
            errors={
                "description": [gettext_lazy("This description is already taken.")]
            },
            message=gettext_lazy("The information you provided could not be saved."),
        )

    serializer.save()
    return no_content_response()
