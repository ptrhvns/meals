import pytest
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.rating_destroy import rating_destroy


def test_http_method_names() -> None:
    assert sets_http_method_names(rating_destroy, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(rating_destroy, permission_classes)


def test_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id = 1
    request = api_rf.post(reverse("rating_destroy", kwargs={"recipe_id": recipe_id}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.rating_destroy.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = rating_destroy(request, recipe_id)
    assert response.status_code == HTTP_404_NOT_FOUND


@pytest.mark.django_db()
def test_destroyed_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user, rating=3)
    request = api_rf.post(reverse("rating_destroy", kwargs={"recipe_id": recipe.id}))
    authenticate(request, user)
    response = rating_destroy(request, recipe.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    recipe.refresh_from_db()
    assert not recipe.rating
