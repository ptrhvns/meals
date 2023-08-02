import pytest
from django.db import Error
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.test import APIRequestFactory

from main.models.email_confirmation_token import EmailConfirmationToken
from main.models.user import User
from main.tests.support.drf_view_helpers import sets_http_method_names
from main.views.signup_create import signup_create


def test_http_method_names() -> None:
    assert sets_http_method_names(signup_create, ["options", "post"])


def test_invalid_request_data(api_rf: APIRequestFactory) -> None:
    request = api_rf.post(reverse("signup_create"), {})
    response = signup_create(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.django_db()
def test_invalid_password(api_rf: APIRequestFactory) -> None:
    request = api_rf.post(
        reverse("signup_create"),
        {
            "username": "smith",
            "email": "smith@example.com",
            "password": "invalid",
        },
    )
    response = signup_create(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]["password"][0]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_creation_of_user_fails(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.post(
        reverse("signup_create"),
        {
            "username": "smith",
            "email": "smith@example.com",
            "password": "alongpassword",
        },
    )
    mocker.patch(
        "main.views.signup_create.User.objects.create_user",
        autospec=True,
        side_effect=Error,
    )
    response = signup_create(request)
    assert response.status_code == HTTP_500_INTERNAL_SERVER_ERROR
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_creation_of_email_confirmaion_token_fails(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.post(
        reverse("signup_create"),
        {
            "username": "smith",
            "email": "smith@example.com",
            "password": "alongpassword",
        },
    )
    mocker.patch(
        "main.views.signup_create.EmailConfirmationToken.objects.create",
        autospec=True,
        side_effect=Error,
    )
    response = signup_create(request)
    assert response.status_code == HTTP_500_INTERNAL_SERVER_ERROR
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_signup_is_successful(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    username = "smith"
    request = api_rf.post(
        reverse("signup_create"),
        {
            "username": username,
            "email": "smith@example.com",
            "password": "alongpassword",
        },
    )
    delay_mock = mocker.patch(
        "main.views.signup_create.send_signup_confirmation.delay", autospec=True
    )
    response = signup_create(request)
    assert response.status_code == HTTP_201_CREATED
    user = User.objects.get(username=username)
    assert EmailConfirmationToken.objects.filter(user=user).exists()
    delay_mock.assert_called()
