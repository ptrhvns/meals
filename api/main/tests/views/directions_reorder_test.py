import pytest
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
)
from rest_framework.test import APIRequestFactory

from main.models.direction import Direction
from main.tests.factories import DirectionFactory, RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.directions_reorder import directions_reorder


def test_http_method_names() -> None:
    assert sets_http_method_names(directions_reorder, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(directions_reorder, permission_classes)


def test_direction_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("directions_reorder"), {"directions": []})
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.directions_reorder.get_list_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = directions_reorder(request)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("directions_reorder"), {"directions": [{"id": 1}]})
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user)
    directions = DirectionFactory.build_batch(size=3, recipe=recipe)
    mocker.patch(
        "main.views.directions_reorder.get_list_or_404",
        autospec=True,
        return_value=directions,
    )
    response = directions_reorder(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.django_db()
def test_reorder_succesfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory()
    request = api_rf.post(
        reverse("directions_reorder"),
        {
            "directions": [
                {"id": 1, "order": 2},
                {"id": 2, "order": 3},
                {"id": 3, "order": 1},
            ]
        },
    )
    authenticate(request, user)
    recipe = RecipeFactory(user=user)
    DirectionFactory(id=1, order=1, recipe=recipe)
    DirectionFactory(id=2, order=2, recipe=recipe)
    DirectionFactory(id=3, order=3, recipe=recipe)
    response = directions_reorder(request)
    assert response.status_code == HTTP_204_NO_CONTENT
    assert Direction.objects.filter(id=1, order=2).exists()
    assert Direction.objects.filter(id=2, order=3).exists()
    assert Direction.objects.filter(id=3, order=1).exists()
