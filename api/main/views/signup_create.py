import logging
from datetime import timedelta
from typing import Any, cast

from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError as DValidationError
from django.db import Error
from django.db.transaction import atomic
from django.utils.timezone import now
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import ValidationError as DRFValidationError

from main.lib.client import ClientUrls
from main.lib.responses import (
    created_response,
    internal_server_error_response,
    invalid_request_data_response,
)
from main.models.email_confirmation_token import EmailConfirmationToken
from main.models.user import User
from main.tasks.send_signup_confirmation import send_signup_confirmation

logger = logging.getLogger(__name__)


class SignupCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def validate_password(self, value: str) -> str:
        try:
            user = self.instance or User(**self.initial_data)
            password_validation.validate_password(value, user)
        except DValidationError as error:
            raise DRFValidationError from error

        return value

    def create(self, validated_data: Any) -> User:
        user = User.objects.create_user(  # type: ignore[attr-defined]
            validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        logger.info("created new user with ID %(user_id)s", {"user_id": user.id})
        return cast(User, user)


@api_view(http_method_names=["POST"])
def signup_create(request: Request) -> Response:
    serializer = SignupCreateRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with atomic():
            user = User.objects.create_user(  # type: ignore[attr-defined]
                username=serializer.validated_data["username"],
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )

            token = EmailConfirmationToken.objects.create(
                expiration=now() + timedelta(hours=24),
                user=user,
            )
    except Error:
        return internal_server_error_response(
            message=gettext_lazy("Your information could not be saved.")
        )

    site_url = ClientUrls.home
    confirmation_url = ClientUrls.signup_confirmation.format(token=token.token)

    logger.info(
        "dispatching task send_signup_confirmation for user ID %(user_id)s",
        {"user_id": user.id},
    )

    send_signup_confirmation.delay(user.id, site_url, confirmation_url)

    return created_response(
        message=gettext_lazy(
            "You were signed up successfully. Please check your email for our"
            " message, and visit the link to confirm your address."
        )
    )
