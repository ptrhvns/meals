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
    TimeFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.time import time


def test_http_method_names() -> None:
    assert sets_http_method_names(time, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(time, permission_classes)


def test_time_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id, time_id = 1, 1
    request = api_rf.get(
        reverse("time", kwargs={"recipe_id": recipe_id, "time_id": time_id})
    )
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.time.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = time(request, recipe_id, time_id)
    assert response.status_code == HTTP_404_NOT_FOUND


@pytest.mark.django_db()
def test_getting_time_succesffully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    time_category = TimeCategoryFactory.create(user=user)
    time_model = TimeFactory.create(
        days=1,
        hours=1,
        minutes=20,
        note="This is a note.",
        recipe=recipe,
        time_category=time_category,
    )
    request = api_rf.get(
        reverse("time", kwargs={"recipe_id": recipe.id, "time_id": time_model.id})
    )
    authenticate(request, user)
    response = time(request, recipe.id, time_model.id)
    assert response.status_code == HTTP_200_OK
    assert loads(dumps(response.data)) == {
        "data": {
            "time": {
                "days": time_model.days,
                "hours": time_model.hours,
                "id": time_model.id,
                "minutes": time_model.minutes,
                "note": time_model.note,
                "time_category": {"id": time_category.id, "name": time_category.name},
            },
        }
    }
