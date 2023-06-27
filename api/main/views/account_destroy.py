import logging

from django.contrib.auth import logout
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, Serializer

from main.lib.responses import (
    forbidden,
    no_content_response,
    unprocessable_entity_response,
)
from main.models.user import User

logger = logging.getLogger(__name__)


class AccountDestroyRequestSerializer(Serializer):
    password = CharField(
        max_length=User._meta.get_field("password").max_length, required=True
    )


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def account_destroy(request: Request) -> Response:
    serializer = AccountDestroyRequestSerializer(data=request.data)

    if not serializer.is_valid():
        logger.warning(
            "account deletion failed with invalid request data for user ID %(user_id)s",
            {"user_id": request.user.id},  # type: ignore[union-attr]
        )

        return unprocessable_entity_response(
            errors=serializer.errors,
            message=gettext_lazy("The information you provided was invalid."),
        )

    password = serializer.validated_data["password"]

    logger.info(
        "checking password for user ID %(user_id)s",
        {"user_id": request.user.id},  # type: ignore[union-attr]
    )

    if not request.user.check_password(password):
        logger.error(
            "invalid password given for user ID %(user_id)s",
            {"user_id": request.user.id},  # type: ignore[union-attr]
        )

        return forbidden(
            errors={"password": [gettext_lazy("Password is invalid.")]},
            message=gettext_lazy("The information you provided was invalid."),
        )

    logger.info(
        "deleting account for user ID %(user_id)s, username %(username)s",
        {
            "user_id": request.user.id,  # type: ignore[union-attr]
            "username": request.user.username,  # type: ignore[union-attr]
        },
    )

    request.user.delete()
    logout(request)
    return no_content_response()
