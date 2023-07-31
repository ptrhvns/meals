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

from main.tests.factories import RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.notes_update import notes_update


def test_http_method_names() -> None:
    assert sets_http_method_names(notes_update, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(notes_update, permission_classes)


def test_notes_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id = 1
    request = api_rf.post(reverse("notes_update", kwargs={"recipe_id": recipe_id}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.notes_update.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = notes_update(request, recipe_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id = 1
    request = api_rf.post(reverse("notes_update", kwargs={"recipe_id": recipe_id}), {})
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user)
    mocker.patch(
        "main.views.notes_update.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    response = notes_update(request, recipe_id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.django_db()
def test_successful_update(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user, notes="This is a note.")
    new_notes = "This is a new note."
    request = api_rf.post(
        reverse("notes_update", kwargs={"recipe_id": recipe.id}),
        {"notes": new_notes},
    )
    authenticate(request, user)
    response = notes_update(request, recipe.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    recipe.refresh_from_db()
    assert new_notes == recipe.notes
