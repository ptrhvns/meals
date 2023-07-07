from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import DirectionFactory, RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.direction import direction


def test_http_method_names() -> None:
    assert sets_http_method_names(direction, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(direction, permission_classes)


def test_direction_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.get(reverse("direction", kwargs={"direction_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.direction.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = direction(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_getting_direction_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.get(reverse("direction", kwargs={"direction_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    drctn = DirectionFactory.build(recipe=RecipeFactory.build(user=user))
    mocker.patch(
        "main.views.direction.get_object_or_404", autospec=True, return_value=drctn
    )
    response = direction(request, 1)
    assert response.status_code == HTTP_200_OK
    assert response.data["data"]["direction"]["description"] == drctn.description  # type: ignore[index]
