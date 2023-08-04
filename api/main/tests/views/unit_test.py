from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import UnitFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.unit import unit


def test_http_method_names() -> None:
    assert sets_http_method_names(unit, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(unit, permission_classes)


def test_unit_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    unit_id = 1
    request = api_rf.get(reverse("unit", kwargs={"unit_id": unit_id}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.unit.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = unit(request, unit_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_getting_unit_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    unit_id = 1
    request = api_rf.get(reverse("unit", kwargs={"unit_id": unit_id}))
    user = UserFactory.build()
    authenticate(request, user)
    unit_model = UnitFactory.build(id=unit_id)
    mocker.patch(
        "main.views.unit.get_object_or_404", autospec=True, return_value=unit_model
    )
    response = unit(request, unit_id)
    assert response.status_code == HTTP_200_OK
    assert response.data["data"]["unit"]["name"] == unit_model.name  # type: ignore[index]
