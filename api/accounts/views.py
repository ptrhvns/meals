import logging
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.db import Error
from django.db.transaction import atomic
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from accounts.models import EmailConfirmationToken, User
from accounts.serializers import (
    LoginSerializer,
    SignupConfirmationSerializer,
    SignupSerializer,
)
from accounts.tasks import send_signup_confirmation
from shared.lib.client import ClientUrls
from shared.lib.responses import (
    created_response,
    internal_server_error_response,
    invalid_request_data_response,
    no_content_response,
    ok_response,
    unprocessable_entity_response,
)

logger = logging.getLogger(__name__)


@api_view(http_method_names=["POST"])
def signup(request: Request) -> Response:
    serializer = SignupSerializer(data=request.data)

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


@api_view(http_method_names=["POST"])
def signup_confirmation(request: Request) -> Response:
    serializer = SignupConfirmationSerializer(data=request.data)

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
            message=_("The signup confirmation ID provided was invalid.")
        )

    now = datetime.now().replace(tzinfo=ZoneInfo(settings.TIME_ZONE))

    if token.expiration < now:
        token.delete()
        return unprocessable_entity_response(
            message=_("The confirmation ID provided was expired.")
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

    return ok_response(message=_("Your signup was successfully confirmed."))


@api_view(http_method_names=["POST"])
def login(request: Request) -> Response:
    username = request.data.get("username")
    logger.info("attempting login for username %(username)s", {"username": username})
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        logger.warning(
            "login failed with invalid request data for username %(username)s",
            {"username": username},
        )
        return invalid_request_data_response(serializer)

    # Authentication will fail if user isn't active.
    user = authenticate(
        request,
        password=serializer.validated_data["password"],
        username=serializer.validated_data["username"],
    )

    if user is None:
        logger.warning(
            "login failed authentication check for username %(username)s",
            {"username": username},
        )
        return unprocessable_entity_response(
            message="We couldn't authenticate you. Your username or password"
            " might be wrong, or there may be an issue with your account."
        )

    logger.info("login succeeded for username %(username)s", {"username": username})
    auth_login(request, user)

    if request.data.get("remember_me"):
        request.session.set_expiry(settings.SESSION_COOKIE_AGE)
    else:
        request.session.set_expiry(0)

    return no_content_response()
