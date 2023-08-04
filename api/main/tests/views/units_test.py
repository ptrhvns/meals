from collections.abc import Mapping
from json import dumps, loads

import pytest
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK
from rest_framework.test import APIRequestFactory

from main.tests.factories import UnitFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.units import units


def test_http_method_names() -> None:
    assert sets_http_method_names(units, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(units, permission_classes)


@pytest.mark.django_db()
def test_get_unit_with_no_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("units"))
    authenticate(request, user)
    unit = UnitFactory.create_batch(size=15, user=user)
    response = units(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["units"] = sorted(data["units"], key=key)
    assert data == {
        "units": sorted([{"id": b.id, "name": b.name} for b in unit], key=key),
    }


@pytest.mark.django_db()
def test_get_unit_with_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("units"), {"page": 2})
    authenticate(request, user)
    unit = UnitFactory.create_batch(size=15, user=user)
    response = units(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["units"] = sorted(data["units"], key=key)
    assert data == {
        "pagination": {
            "page": 2,
            "total": 2,
        },
        "units": sorted([{"id": b.id, "name": b.name} for b in unit], key=key)[10:],
    }
