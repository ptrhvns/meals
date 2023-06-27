from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import BrandFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.brand_destroy import brand_destroy


def test_http_method_names() -> None:
    assert sets_http_method_names(brand_destroy, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(brand_destroy, permission_classes)


def test_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("brand_destroy", kwargs={"brand_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.brand_destroy.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = brand_destroy(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_destroyed_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.post(reverse("brand_destroy", kwargs={"brand_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    brand = BrandFactory.build(user=user)
    mocker.patch.object(brand, "delete")
    mocker.patch(
        "main.views.brand_destroy.get_object_or_404", autospec=True, return_value=brand
    )
    response = brand_destroy(request, 1)
    assert response.status_code == HTTP_204_NO_CONTENT
    assert brand.delete.called  # pyright: ignore
