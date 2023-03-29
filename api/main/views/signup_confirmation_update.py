import logging
from datetime import datetime
from zoneinfo import ZoneInfo

from django.conf import settings
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, ModelSerializer

from main.lib.responses import (
    invalid_request_data_response,
    ok_response,
    unprocessable_entity_response,
)
from main.models.email_confirmation_token import EmailConfirmationToken

logger = logging.getLogger(__name__)


class SignupConfirmationUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = EmailConfirmationToken
        fields = ("token",)

    token = CharField(max_length=256, required=True)


@api_view(http_method_names=["POST"])
def signup_confirmation_update(request: Request) -> Response:
    serializer = SignupConfirmationUpdateRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    token_id = serializer.validated_data.get("token")

    try:
        token = EmailConfirmationToken.objects.get(token=token_id)
    except EmailConfirmationToken.DoesNotExist:
        logger.warning(
            "signup confirmation token from request not found: %(token)s",
            {"token": token_id},
        )
        return unprocessable_entity_response(
            message=gettext_lazy("The signup confirmation ID provided was invalid.")
        )

    now = datetime.now(tz=ZoneInfo(settings.TIME_ZONE))

    if token.expiration < now:
        token.delete()
        return unprocessable_entity_response(
            message=gettext_lazy("The confirmation ID provided was expired.")
        )

    user = token.user
    token.delete()
    user.email_confirmed_datetime = now
    user.is_active = True
    user.save()

    logger.info(
        "signup confirmed for user with ID %(user_id)s",
        {"user_id": user.id},  # type: ignore[attr-defined]
    )

    return ok_response(message=gettext_lazy("Your signup was successfully confirmed."))
