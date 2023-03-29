import logging

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BooleanField, CharField, Serializer

from main.lib.responses import (
    invalid_request_data_response,
    no_content_response,
    unprocessable_entity_response,
)
from main.models.user import User

logger = logging.getLogger(__name__)


class LoginRequestSerializer(Serializer):
    password = CharField(
        max_length=User._meta.get_field("password").max_length, required=True
    )
    remember_me = BooleanField()
    username = CharField(
        max_length=User._meta.get_field("username").max_length, required=True
    )


@api_view(http_method_names=["POST"])
def login(request: Request) -> Response:
    username = request.data.get("username")
    logger.info("attempting login for username %(username)s", {"username": username})
    serializer = LoginRequestSerializer(data=request.data)

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
