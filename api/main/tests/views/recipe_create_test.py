import pytest
from django.urls import reverse
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_422_UNPROCESSABLE_ENTITY,
)
from rest_framework.test import APIRequestFactory

from main.models.recipe import Recipe
from main.tests.factories import UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.recipe_create import recipe_create


def test_http_method_names() -> None:
    assert sets_http_method_names(recipe_create, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(recipe_create, permission_classes)


def test_invalid_request_data(api_rf: APIRequestFactory) -> None:
    request = api_rf.post(reverse("recipe_create"), {})
    user = UserFactory.build()
    authenticate(request, user)
    response = recipe_create(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_successful_creation(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    title = "Biscuits"
    request = api_rf.post(reverse("recipe_create"), {"title": title})
    authenticate(request, user)
    response = recipe_create(request)
    assert response.status_code == HTTP_201_CREATED
    assert Recipe.objects.filter(title=title).count() == 1
