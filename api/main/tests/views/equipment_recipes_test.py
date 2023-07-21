from collections.abc import Mapping
from json import dumps, loads

import pytest
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import (
    EquipmentFactory,
    RecipeFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.equipment_recipes import equipment_recipes


def test_http_method_names() -> None:
    assert sets_http_method_names(equipment_recipes, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(equipment_recipes, permission_classes)


def test_equipment_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.get(reverse("equipment_recipes", kwargs={"equipment_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.equipment_recipes.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = equipment_recipes(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


@pytest.mark.django_db()
def test_getting_recipes_successfully(api_rf: APIRequestFactory) -> None:
    request = api_rf.get(reverse("equipment_recipes", kwargs={"equipment_id": 1}))
    user = UserFactory.create()
    authenticate(request, user)
    recipes = RecipeFactory.create_batch(size=3, user=user)
    equipment = EquipmentFactory(user=user)
    for recipe in recipes:
        recipe.equipment.add(equipment)
    response = equipment_recipes(request, equipment.id)  # pyright: ignore
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["recipes"] = sorted(data["recipes"], key=key)
    assert data == {
        "pagination": {
            "page": 1,
            "total": 1,
        },
        "recipes": sorted([{"id": r.id, "title": r.title} for r in recipes], key=key),
    }
