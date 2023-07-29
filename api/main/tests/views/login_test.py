import pytest
from django.conf import settings
from django.urls import reverse
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_422_UNPROCESSABLE_ENTITY
from rest_framework.test import APIClient, APIRequestFactory

from main.tests.factories import UserFactory
from main.tests.support.drf_view_helpers import sets_http_method_names
from main.views.login import login


def test_http_method_names() -> None:
    assert sets_http_method_names(login, ["options", "post"])


def test_logging_in_with_invalid_data(api_rf: APIRequestFactory) -> None:
    request = api_rf.post(reverse("login"), {})
    response = login(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["message"]) > 0  # type: ignore[index]
    assert len(response.data["errors"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_logging_in_successfully(api_client: APIClient) -> None:
    password = "alongpassword"  # noqa: S105
    username = "smith"
    UserFactory.create(password=password, username=username)
    response = api_client.post(
        reverse("login"), {"password": password, "username": username}
    )
    assert response.status_code == HTTP_204_NO_CONTENT
    assert "sessionid" in response.cookies


@pytest.mark.django_db()
def test_logging_in_with_remember_me_set(api_client: APIClient) -> None:
    password = "alongpassword"  # noqa: S105
    username = "smith"
    UserFactory.create(password=password, username=username)
    response = api_client.post(
        reverse("login"),
        {"password": password, "remember_me": True, "username": username},
    )
    assert not response.client.session.get_expire_at_browser_close()
    assert response.client.session.get_expiry_age() == settings.SESSION_COOKIE_AGE


@pytest.mark.django_db()
def test_logging_in_without_remember_me_set(api_client: APIClient) -> None:
    password = "alongpassword"  # noqa: S105
    username = "smith"
    UserFactory.create(password=password, username=username)
    response = api_client.post(
        reverse("login"), {"password": password, "username": username}
    )
    assert response.client.session.get_expire_at_browser_close()


@pytest.mark.django_db()
def test_logging_in_with_invalid_credentials(api_client: APIClient) -> None:
    username = "smith"
    UserFactory.create(password="alongpassword", username=username)  # noqa: S106
    response = api_client.post(
        reverse("login"), {"password": "invalid", "username": username}
    )
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_logging_in_with_an_inactive_user(api_client: APIClient) -> None:
    password = "alongpassword"  # noqa: S105
    username = "smith"
    UserFactory.create(is_active=False, password=password, username=username)
    response = api_client.post(
        reverse("login"), {"password": password, "username": username}
    )
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["message"]) > 0  # type: ignore[index]
