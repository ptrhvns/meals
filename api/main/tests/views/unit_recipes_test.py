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
    FoodFactory,
    IngredientFactory,
    RecipeFactory,
    UnitFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.unit_recipes import unit_recipes


def test_http_method_names() -> None:
    assert sets_http_method_names(unit_recipes, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(unit_recipes, permission_classes)


def test_unit_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    unit_id = 1
    request = api_rf.get(reverse("unit_recipes", kwargs={"unit_id": unit_id}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.unit_recipes.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = unit_recipes(request, unit_id)
    assert response.status_code == HTTP_404_NOT_FOUND


@pytest.mark.django_db()
def test_getting_recipes_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipes = RecipeFactory.create_batch(size=3, user=user)
    unit = UnitFactory.create(user=user)
    for recipe in recipes:
        IngredientFactory.create(
            food=FoodFactory.create(user=user), recipe=recipe, unit=unit
        )
    request = api_rf.get(reverse("unit_recipes", kwargs={"unit_id": unit.id}))
    authenticate(request, user)
    response = unit_recipes(request, unit.id)
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
