from typing import Any, Optional

from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

# Generic responses


def response(
    data: Optional[object] = None,
    errors: Optional[object] = None,
    message: Optional[str] = None,
    status: int = status.HTTP_200_OK,
) -> Response:
    generic_data = {}

    if data:
        generic_data["data"] = data

    if errors:
        generic_data["errors"] = errors

    if message:
        generic_data["message"] = message

    return (
        Response(generic_data, status=status)
        if generic_data
        else Response(status=status)
    )


def created_response(*args: Any, **kwargs: Any) -> Response:
    return response(*args, **dict(kwargs, status=status.HTTP_201_CREATED))


def forbidden(*args: Any, **kwargs: Any) -> Response:
    return response(*args, **dict(kwargs, status=status.HTTP_403_FORBIDDEN))


def internal_server_error_response(*args: Any, **kwargs: Any) -> Response:
    return response(*args, **dict(kwargs, status=status.HTTP_500_INTERNAL_SERVER_ERROR))


def no_content_response(*args: Any, **kwargs: Any) -> Response:
    return response(*args, **dict(kwargs, status=status.HTTP_204_NO_CONTENT))


def ok_response(*args: Any, **kwargs: Any) -> Response:
    return response(*args, **dict(kwargs, status=status.HTTP_200_OK))


def unprocessable_entity_response(*args: Any, **kwargs: Any) -> Response:
    return response(*args, **dict(kwargs, status=status.HTTP_422_UNPROCESSABLE_ENTITY))


# Specific responses


def data_response(data: object) -> Response:
    return ok_response(data=data)


def invalid_request_data_response(serializer: BaseSerializer) -> Response:
    return unprocessable_entity_response(
        errors=serializer.errors,
        message=_("The information you provided was invalid."),
    )
