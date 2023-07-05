from django.urls import reverse
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.test import APIClient

from main.tests.support.drf_view_helpers import sets_http_method_names
from main.views.csrf_token import csrf_token


def test_http_method_names() -> None:
    assert sets_http_method_names(csrf_token, ["get", "options"])


def test_sets_csrf_cookie(api_client: APIClient) -> None:
    response = api_client.get(reverse("csrf_token"))
    assert response.status_code == HTTP_204_NO_CONTENT
    assert "csrftoken" in response.cookies
