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
    RecipeFactory,
    TimeCategoryFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.time_category_recipes import time_category_recipes


def test_http_method_names() -> None:
    assert sets_http_method_names(time_category_recipes, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(time_category_recipes, permission_classes)


def test_time_category_not_found(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    time_category_id = 1
    request = api_rf.get(
        reverse("time_category_recipes", kwargs={"time_category_id": time_category_id})
    )
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.time_category_recipes.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = time_category_recipes(request, time_category_id)
    assert response.status_code == HTTP_404_NOT_FOUND


@pytest.mark.django_db()
def test_getting_recipes_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipes = RecipeFactory.create_batch(size=3, user=user)
    time_category = TimeCategoryFactory.create(user=user)

    for recipe in recipes:
        recipe.time_categories.add(time_category)

    request = api_rf.get(
        reverse("time_category_recipes", kwargs={"time_category_id": time_category.id})
    )
    authenticate(request, user)

    response = time_category_recipes(request, time_category.id)
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
