import logging
from datetime import timedelta

from django.db import Error
from django.db.transaction import atomic
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from accounts.models import EmailConfirmationToken
from accounts.serializers import SignupSerializer
from accounts.tasks import send_signup_confirmation
from shared.lib.client import ClientUrls
from shared.lib.responses import (
    created_response,
    internal_server_error_response,
    invalid_request_data_response,
)

logger = logging.getLogger(__name__)


@api_view(http_method_names=["POST"])
def signup(request: Request) -> Response:
    serializer = SignupSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with atomic():
            user = serializer.save()

            token = EmailConfirmationToken.objects.create(
                expiration=now() + timedelta(hours=24),
                user=user,
            )
    except Error:
        return internal_server_error_response(
            message=_("Your information could not be saved.")
        )

    site_url = ClientUrls.home
    confirmation_url = ClientUrls.signup_confirmation.format(token=token.token)

    logger.info(
        "dispatching task send_signup_confirmation for user ID %(user_id)s",
        {"user_id": user.id},
    )

    send_signup_confirmation.delay(user.id, site_url, confirmation_url)

    return created_response(
        message=_(
            "You were signed up successfully. Please check your email for our"
            " message, and visit the link to confirm your address."
        )
    )
