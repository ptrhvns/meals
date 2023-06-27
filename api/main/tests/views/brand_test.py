from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import BrandFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.brand import brand


def test_http_method_names() -> None:
    assert sets_http_method_names(brand, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(brand, permission_classes)


def test_ingredient_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.get(reverse("brand", kwargs={"brand_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.brand.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = brand(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_getting_brand_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.get(reverse("brand", kwargs={"brand_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    brand_instance = BrandFactory.build(user=user, id=1, name="Acme")
    mocker.patch(
        "main.views.brand.get_object_or_404", autospec=True, return_value=brand_instance
    )
    response = brand(request, 1)
    assert response.status_code == HTTP_200_OK
    assert response.data["data"]["brand"]["name"] == brand_instance.name  # type: ignore[index]
