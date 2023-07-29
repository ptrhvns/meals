import logging
from typing import cast

from django.contrib import auth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.user import User

logger = logging.getLogger(__name__)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def logout(request: Request) -> Response:
    logger.info(
        "logging out username `%(username)s`",
        {"username": cast(User, request.user).username},
    )
    auth.logout(request)
    return no_content_response()
