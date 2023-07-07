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

from main.tests.factories import DirectionFactory, RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.direction_update import direction_update


def test_http_method_names() -> None:
    assert sets_http_method_names(direction_update, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(direction_update, permission_classes)


def test_direction_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("direction_update", kwargs={"direction_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.direction_update.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = direction_update(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("direction_update", kwargs={"direction_id": 1}), {})
    user = UserFactory.build()
    authenticate(request, user)
    direction = DirectionFactory.build(recipe=RecipeFactory.build(user=user))
    mocker.patch(
        "main.views.direction_update.get_object_or_404",
        autospec=True,
        return_value=direction,
    )
    response = direction_update(request, 1)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.django_db()
def test_updated_direction_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    direction = DirectionFactory.create(description="Old", recipe=recipe)
    request = api_rf.post(
        reverse("direction_update", kwargs={"direction_id": direction.id}),
        {"description": "New"},
    )
    authenticate(request, user)
    response = direction_update(request, direction.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    direction.refresh_from_db()
    assert direction.description == "New"
