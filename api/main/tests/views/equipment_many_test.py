from collections.abc import Mapping
from json import dumps, loads

import pytest
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK
from rest_framework.test import APIRequestFactory

from main.tests.factories import EquipmentFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.equipment_many import equipment_many


def test_http_method_names() -> None:
    assert sets_http_method_names(equipment_many, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(equipment_many, permission_classes)


@pytest.mark.django_db()
def test_get_equipment_with_no_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("equipment_many"))
    authenticate(request, user)
    equipment = EquipmentFactory.create_batch(size=15, user=user)
    response = equipment_many(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["equipmentMany"] = sorted(data["equipmentMany"], key=key)
    assert data == {
        "equipmentMany": sorted(
            [{"id": b.id, "description": b.description} for b in equipment], key=key
        ),
    }


@pytest.mark.django_db()
def test_get_equipment_with_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("equipment_many"), {"page": 2})
    authenticate(request, user)
    equipment = EquipmentFactory.create_batch(size=15, user=user)
    response = equipment_many(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["equipmentMany"] = sorted(data["equipmentMany"], key=key)
    assert data == {
        "pagination": {
            "page": 2,
            "total": 2,
        },
        "equipmentMany": sorted(
            [{"id": b.id, "description": b.description} for b in equipment], key=key
        )[10:],
    }
