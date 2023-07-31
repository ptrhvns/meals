from json import dumps, loads

from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.rating import rating


def test_http_method_names() -> None:
    assert sets_http_method_names(rating, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(rating, permission_classes)


def test_rating_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.get(reverse("rating", kwargs={"recipe_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.rating.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = rating(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_getting_rating_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    rating_value = 3
    user = UserFactory.build()
    recipe = RecipeFactory.build(id=1, user=user, rating=rating_value)
    request = api_rf.get(reverse("rating", kwargs={"recipe_id": recipe.id}))
    authenticate(request, user)
    mocker.patch(
        "main.views.rating.get_object_or_404", autospec=True, return_value=recipe
    )
    response = rating(request, recipe.id)
    assert response.status_code == HTTP_200_OK
    assert loads(dumps(response.data)) == {"data": {"rating": rating_value}}
