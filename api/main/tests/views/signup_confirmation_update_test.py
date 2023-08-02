from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest
from django.conf import settings
from django.urls import reverse
from rest_framework.status import HTTP_200_OK, HTTP_422_UNPROCESSABLE_ENTITY
from rest_framework.test import APIRequestFactory

from main.lib.tokens import build_token
from main.models.email_confirmation_token import EmailConfirmationToken
from main.tests.factories import EmailConfirmationTokenFactory, UserFactory
from main.tests.support.drf_view_helpers import sets_http_method_names
from main.views.signup_confirmation_update import signup_confirmation_update


def test_http_method_names() -> None:
    assert sets_http_method_names(signup_confirmation_update, ["options", "post"])


def test_invalid_request_data(api_rf: APIRequestFactory) -> None:
    request = api_rf.post(reverse("signup_confirmation_update"), {})
    response = signup_confirmation_update(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.django_db()
def test_non_existant_token(api_rf: APIRequestFactory) -> None:
    invalid_token = build_token()
    request = api_rf.post(
        reverse("signup_confirmation_update"), {"token": invalid_token}
    )
    response = signup_confirmation_update(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_token_already_expired(api_rf: APIRequestFactory) -> None:
    token = build_token()
    now = datetime.now(tz=ZoneInfo(settings.TIME_ZONE))
    passed_expiration = now - timedelta(hours=1)
    EmailConfirmationTokenFactory.create(
        expiration=passed_expiration,
        token=token,
        user=UserFactory.create(is_active=False),
    )
    request = api_rf.post(reverse("signup_confirmation_update"), {"token": token})
    response = signup_confirmation_update(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.django_db()
def test_test_confirmation_success(api_rf: APIRequestFactory) -> None:
    token = build_token()
    user = UserFactory.create(is_active=False)
    EmailConfirmationTokenFactory.create(token=token, user=user)
    request = api_rf.post(reverse("signup_confirmation_update"), {"token": token})
    response = signup_confirmation_update(request)
    assert response.status_code == HTTP_200_OK
    assert not EmailConfirmationToken.objects.filter(token=token).exists()
    user.refresh_from_db()
    assert user.email_confirmed_datetime is not None
    assert user.is_active
