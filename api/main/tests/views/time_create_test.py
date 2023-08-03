import pytest
from django.db import Error
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.test import APIRequestFactory

# from main.models.time import Time
from main.tests.factories import (
    RecipeFactory,
    # TimeFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.time_create import time_create


def test_http_method_names() -> None:
    assert sets_http_method_names(time_create, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(time_create, permission_classes)


def test_recipe_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id = 1
    request = api_rf.post(reverse("time_create", kwargs={"recipe_id": recipe_id}), {})
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.time_create.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = time_create(request, recipe_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    user = UserFactory.build()
    recipe = RecipeFactory.build(user=user, id=1)
    request = api_rf.post(reverse("time_create", kwargs={"recipe_id": recipe.id}), {})
    authenticate(request, user)
    mocker.patch(
        "main.views.time_create.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    response = time_create(request, recipe.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_creates_time_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    time_data = {
        "days": 1,
        "hours": 1,
        "minutes": 1,
        "note": "This is a note.",
        "time_category": {"name": "cook"},
    }
    request = api_rf.post(
        reverse("time_create", kwargs={"recipe_id": recipe.id}), time_data
    )
    authenticate(request, user)
    response = time_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    recipe.refresh_from_db()
    time = recipe.times.first()
    assert time.days == time_data["days"]
    assert time.hours == time_data["hours"]
    assert time.minutes == time_data["minutes"]
    assert time.note == time_data["note"]
    assert time.time_category.name == time_data["time_category"]["name"]  # type: ignore[index]


@pytest.mark.django_db()
def test_time_creation_fails_missing_any_unit(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    time_data = {
        "note": "This is a note.",
        "time_category": {"name": "cook"},
    }
    request = api_rf.post(
        reverse("time_create", kwargs={"recipe_id": recipe.id}), time_data
    )
    authenticate(request, user)
    response = time_create(request, recipe.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_time_creation_fails(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    time_data = {
        "days": 1,
        "hours": 1,
        "minutes": 1,
        "note": "This is a note.",
        "time_category": {"name": "cook"},
    }
    request = api_rf.post(
        reverse("time_create", kwargs={"recipe_id": recipe.id}), time_data
    )
    authenticate(request, user)
    mocker.patch(
        "main.views.time_create.TimeCategory.objects.get_or_create",
        autospec=True,
        side_effect=Error,
    )
    response = time_create(request, recipe.id)
    assert response.status_code == HTTP_500_INTERNAL_SERVER_ERROR
    assert len(response.data["message"]) > 0  # type: ignore[index]
