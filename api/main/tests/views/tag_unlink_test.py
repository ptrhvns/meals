import pytest
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.models.recipe import Recipe
from main.models.tag import Tag
from main.tests.factories import RecipeFactory, TagFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.tag_unlink import tag_unlink


def test_http_method_names() -> None:
    assert sets_http_method_names(tag_unlink, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(tag_unlink, permission_classes)


def test_recipe_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id, tag_id = 1, 1
    request = api_rf.post(
        reverse("tag_unlink", kwargs={"recipe_id": recipe_id, "tag_id": tag_id})
    )
    user = UserFactory.build()
    authenticate(request, user)

    def fake_get_object_or_404(klass, *args, **kwargs):  # type: ignore[no-untyped-def]
        if klass == Recipe:
            raise Http404
        if klass == Tag:
            return TagFactory.build(user=user)
        raise Exception(f"unexpected class: {klass}")

    mocker.patch("main.views.tag_unlink.get_object_or_404", new=fake_get_object_or_404)
    response = tag_unlink(request, recipe_id, tag_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_tag_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id, tag_id = 1, 1
    request = api_rf.post(
        reverse("tag_unlink", kwargs={"recipe_id": recipe_id, "tag_id": tag_id})
    )
    user = UserFactory.build()
    authenticate(request, user)

    def fake_get_object_or_404(klass, *args, **kwargs):  # type: ignore[no-untyped-def]
        if klass == Recipe:
            return RecipeFactory.build(user=user)
        if klass == Tag:
            raise Http404
        raise Exception(f"unexpected class: {klass}")

    mocker.patch("main.views.tag_unlink.get_object_or_404", new=fake_get_object_or_404)
    response = tag_unlink(request, recipe_id, tag_id)
    assert response.status_code == HTTP_404_NOT_FOUND


@pytest.mark.django_db()
def test_tag_unlinked_from_recipe(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    tag = TagFactory.create(user=user)
    recipe = RecipeFactory.create(user=user)
    recipe.tags.add(tag)
    request = api_rf.post(
        reverse(
            "tag_unlink",
            kwargs={"recipe_id": recipe.id, "tag_id": tag.id},
        )
    )
    authenticate(request, user)
    response = tag_unlink(request, recipe.id, tag.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    recipe.refresh_from_db()
    assert not recipe.tags.contains(tag)
