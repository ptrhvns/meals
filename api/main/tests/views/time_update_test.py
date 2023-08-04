import pytest
from django.db import Error
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.test import APIRequestFactory

from main.tests.factories import (
    RecipeFactory,
    TimeCategoryFactory,
    TimeFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.time_update import time_update


def test_http_method_names() -> None:
    assert sets_http_method_names(time_update, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(time_update, permission_classes)


def test_recipe_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id, time_id = 1, 1
    request = api_rf.post(
        reverse("time_update", kwargs={"recipe_id": recipe_id, "time_id": time_id}), {}
    )
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.time_update.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = time_update(request, recipe_id, time_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    user = UserFactory.build()
    recipe = RecipeFactory.build(id=1, user=user)
    time = TimeFactory.build(id=1, recipe=recipe)
    request = api_rf.post(
        reverse("time_update", kwargs={"recipe_id": recipe.id, "time_id": time.id}), {}
    )
    authenticate(request, user)
    mocker.patch(
        "main.views.time_update.get_object_or_404",
        autospec=True,
        return_value=time,
    )
    response = time_update(request, recipe.id, time.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_updates_time_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    time_category = TimeCategoryFactory.create(user=user)
    time = TimeFactory.create(recipe=recipe, minutes=1, time_category=time_category)
    new_minutes = 20
    request = api_rf.post(
        reverse("time_update", kwargs={"recipe_id": recipe.id, "time_id": time.id}),
        {"minutes": new_minutes, "time_category": {"name": time_category.name}},
    )
    authenticate(request, user)
    response = time_update(request, recipe.id, time.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    time.refresh_from_db()
    assert time.minutes == new_minutes


@pytest.mark.django_db()
def test_time_update_fails_missing_any_unit(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    time_category = TimeCategoryFactory.create(user=user)
    time = TimeFactory.create(recipe=recipe, minutes=1, time_category=time_category)
    request = api_rf.post(
        reverse("time_update", kwargs={"recipe_id": recipe.id, "time_id": time.id}),
        {"time_category": {"name": time_category.name}},
    )
    authenticate(request, user)
    response = time_update(request, recipe.id, time.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_time_update_fails(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    time_category = TimeCategoryFactory.create(user=user)
    time = TimeFactory.create(recipe=recipe, minutes=1, time_category=time_category)
    request = api_rf.post(
        reverse("time_update", kwargs={"recipe_id": recipe.id, "time_id": time.id}),
        {"minutes": 20, "time_category": {"name": time_category.name}},
    )
    authenticate(request, user)
    mocker.patch(
        "main.views.time_update.TimeCategory.objects.get_or_create",
        autospec=True,
        side_effect=Error,
    )
    response = time_update(request, recipe.id, time.id)
    assert response.status_code == HTTP_500_INTERNAL_SERVER_ERROR
    assert len(response.data["message"]) > 0  # type: ignore[index]
