from collections.abc import Mapping
from json import dumps, loads

import pytest
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK
from rest_framework.test import APIRequestFactory

from main.tests.factories import FoodFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.food_many import food_many


def test_http_method_names() -> None:
    assert sets_http_method_names(food_many, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(food_many, permission_classes)


@pytest.mark.django_db()
def test_get_food_with_no_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("food_many"))
    authenticate(request, user)
    food = FoodFactory.create_batch(size=15, user=user)
    response = food_many(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["foodMany"] = sorted(data["foodMany"], key=key)
    assert data == {
        "foodMany": sorted([{"id": b.id, "name": b.name} for b in food], key=key),
    }


@pytest.mark.django_db()
def test_get_food_with_query(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    user = UserFactory.create()
    name = "specific food"
    request = api_rf.get(reverse("food_many"), {"query": name})
    authenticate(request, user)
    FoodFactory.create_batch(size=15, user=user)
    specific_food = FoodFactory.create(name=name, user=user)
    response = food_many(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]
    assert data == {
        "foodMany": [{"id": specific_food.id, "name": specific_food.name}],
    }


@pytest.mark.django_db()
def test_get_food_with_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("food_many"), {"page": 2})
    authenticate(request, user)
    food = FoodFactory.create_batch(size=15, user=user)
    response = food_many(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["foodMany"] = sorted(data["foodMany"], key=key)
    assert data == {
        "pagination": {
            "page": 2,
            "total": 2,
        },
        "foodMany": sorted([{"id": b.id, "name": b.name} for b in food], key=key)[10:],
    }
