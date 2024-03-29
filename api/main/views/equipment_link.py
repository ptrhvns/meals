from django.db import Error
from django.db.transaction import atomic
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, ModelSerializer

from main.lib.responses import (
    created_response,
    internal_server_error_response,
    invalid_request_data_response,
    ok_response,
)
from main.models.equipment import Equipment
from main.models.recipe import Recipe


class EquipmentLinkSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("description",)

    description = CharField(max_length=256, required=True)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def equipment_link(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = EquipmentLinkSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with atomic():
            equipment, created = Equipment.objects.get_or_create(
                defaults={"user": request.user, **serializer.validated_data},
                description__iexact=serializer.validated_data["description"],
                user=request.user,
            )

            if not equipment.recipes.contains(recipe):
                equipment.recipes.add(recipe)
    except Error:
        return internal_server_error_response(
            message=gettext_lazy("Your information could not be saved.")
        )

    return created_response() if created else ok_response()
