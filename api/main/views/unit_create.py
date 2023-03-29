from django.db import Error
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import (
    created_response,
    internal_server_error_response,
    invalid_request_data_response,
    ok_response,
)
from main.models.unit import Unit


class UnitCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = Unit
        fields = ("name",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def unit_create(request: Request) -> Response:
    serializer = UnitCreateRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        created, _ = Unit.objects.get_or_create(
            defaults={"user": request.user, **serializer.validated_data},
            name__iexact=serializer.validated_data["name"],
            user=request.user,
        )
    except Error:
        return internal_server_error_response(
            message=gettext_lazy("Your information could not be saved.")
        )

    return created_response() if created else ok_response()
