import pytest
from django.urls import reverse
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_403_FORBIDDEN,
    HTTP_422_UNPROCESSABLE_ENTITY,
)
from rest_framework.test import APIClient, APIRequestFactory

from main.models.user import User
from main.tests.factories import UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.account_destroy import account_destroy


def test_http_method_names() -> None:
    assert sets_http_method_names(account_destroy, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(account_destroy, permission_classes)


def test_invalid_request_data(api_rf: APIRequestFactory) -> None:
    request = api_rf.post(reverse("account_destroy"), {})
    user = UserFactory.build()
    authenticate(request, user)
    response = account_destroy(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


def test_incorrect_password(api_rf: APIRequestFactory) -> None:
    request = api_rf.post(reverse("account_destroy"), {"password": "invalid"})
    user = UserFactory.build()
    authenticate(request, user)
    response = account_destroy(request)
    assert response.status_code == HTTP_403_FORBIDDEN
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_deleting_account_successfully(api_client: APIClient) -> None:
    password = "alongpassword"  # noqa: S105
    user = UserFactory.create(password=password)
    api_client.login(username=user.username, password=password)
    response = api_client.post(reverse("account_destroy"), {"password": password})
    assert not User.objects.filter(username=user.username).exists()
    assert response.status_code == HTTP_204_NO_CONTENT
