import pytest
from rest_framework.test import APIClient, APIRequestFactory


@pytest.fixture()
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture()
def api_rf() -> APIRequestFactory:
    return APIRequestFactory()
