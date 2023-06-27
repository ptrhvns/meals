from rest_framework.request import Request
from rest_framework.test import force_authenticate

from main.models.user import User


def authenticate(request: Request, user: User) -> None:
    force_authenticate(request, user=user)
    request.user = user
