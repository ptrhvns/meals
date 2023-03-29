from django.contrib.auth import logout as auth_logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def logout(request: Request) -> Response:
    auth_logout(request)
    return no_content_response()
