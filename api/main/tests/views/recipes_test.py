from collections.abc import Mapping
from json import dumps, loads

import pytest
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK
from rest_framework.test import APIRequestFactory

from main.tests.factories import RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.recipes import recipes


def test_http_method_names() -> None:
    assert sets_http_method_names(recipes, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(recipes, permission_classes)


@pytest.mark.django_db()
def test_get_recipes_with_no_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("recipes"))
    authenticate(request, user)
    recipe_models = RecipeFactory.create_batch(size=15, user=user)
    response = recipes(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["recipes"] = sorted(data["recipes"], key=key)
    assert data == {
        "recipes": sorted(
            [{"id": b.id, "title": b.title} for b in recipe_models], key=key
        ),
    }


@pytest.mark.django_db()
def test_get_recipes_with_query(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    title = "specific recipes"
    request = api_rf.get(reverse("recipes"), {"query": title})
    authenticate(request, user)
    RecipeFactory.create_batch(size=15, user=user)
    specific_recipe = RecipeFactory.create(title=title, user=user)
    response = recipes(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]
    assert data == {
        "recipes": [{"id": specific_recipe.id, "title": specific_recipe.title}],
    }


@pytest.mark.django_db()
def test_get_recipes_with_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("recipes"), {"page": 2})
    authenticate(request, user)
    recipe_models = RecipeFactory.create_batch(size=15, user=user)
    response = recipes(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["recipes"] = sorted(data["recipes"], key=key)
    assert data == {
        "pagination": {
            "page": 2,
            "total": 2,
        },
        "recipes": sorted(
            [{"id": b.id, "title": b.title} for b in recipe_models], key=key
        )[10:],
    }
