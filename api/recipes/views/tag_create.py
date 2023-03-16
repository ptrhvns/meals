from django.db import Error
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Tag
from shared.lib.responses import (
    created_response,
    internal_server_error_response,
    invalid_request_data_response,
    ok_response,
)


class TagRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_create(request: Request) -> Response:
    serializer = TagRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        created = (
            Tag.objects.get_or_create(
                defaults={"user": request.user, **serializer.validated_data},
                name__iexact=serializer.validated_data["name"],
                user=request.user,
            )
        )[0]
    except Error:
        return internal_server_error_response(
            message=gettext_lazy("Your information could not be saved.")
        )

    return created_response() if created else ok_response()
