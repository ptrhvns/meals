import pytest
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.test import APIClient

from main.tests.factories import UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.views.logout import logout


def test_http_method_names() -> None:
    assert sets_http_method_names(logout, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(logout, permission_classes)


@pytest.mark.django_db()
def test_logging_out_successfully(api_client: APIClient, mocker: MockerFixture) -> None:
    password = "alongpassword"  # noqa: S105
    username = "smith"
    UserFactory.create(password=password, username=username)
    logout_mock = mocker.patch("main.views.logout.auth.logout")
    api_client.login(username=username, password=password)
    response = api_client.post(reverse("logout"))
    assert response.status_code == HTTP_204_NO_CONTENT
    logout_mock.assert_called()
