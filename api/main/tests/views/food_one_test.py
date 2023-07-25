from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import FoodFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.food_one import food_one


def test_http_method_names() -> None:
    assert sets_http_method_names(food_one, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(food_one, permission_classes)


def test_food_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.get(reverse("food_one", kwargs={"food_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.food_one.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = food_one(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_getting_food_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.get(reverse("food_one", kwargs={"food_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    food = FoodFactory.build()
    mocker.patch(
        "main.views.food_one.get_object_or_404", autospec=True, return_value=food
    )
    response = food_one(request, 1)
    assert response.status_code == HTTP_200_OK
    assert response.data["data"]["foodOne"]["name"] == food.name  # type: ignore[index]
