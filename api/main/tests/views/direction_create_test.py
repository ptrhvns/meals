import pytest
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
)
from rest_framework.test import APIRequestFactory

from main.models.direction import Direction
from main.tests.factories import RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.direction_create import direction_create


def test_http_method_names() -> None:
    assert sets_http_method_names(direction_create, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(direction_create, permission_classes)


def test_recipe_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("direction_create", kwargs={"recipe_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.direction_create.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = direction_create(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id = 1
    request = api_rf.post(
        reverse("direction_create", kwargs={"recipe_id": recipe_id}), {}
    )
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user, id=recipe_id)
    mocker.patch(
        "main.views.direction_create.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    response = direction_create(request, recipe_id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_creates_direction_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    description = "Cook the food."
    request = api_rf.post(
        reverse("direction_create", kwargs={"recipe_id": recipe.id}),
        {"description": description},
    )
    authenticate(request, user)
    response = direction_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    count = Direction.objects.filter(description=description, recipe=recipe).count()
    assert count == 1
