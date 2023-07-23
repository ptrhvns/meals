import pytest
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.models.equipment import Equipment
from main.models.recipe import Recipe
from main.tests.factories import EquipmentFactory, RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.equipment_unlink import equipment_unlink


def test_http_method_names() -> None:
    assert sets_http_method_names(equipment_unlink, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(equipment_unlink, permission_classes)


def test_recipe_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(
        reverse("equipment_unlink", kwargs={"equipment_id": 1, "recipe_id": 1})
    )
    user = UserFactory.build()
    authenticate(request, user)

    def fake_get_object_or_404(klass, *args, **kwargs):  # type: ignore[no-untyped-def]
        if klass == Recipe:
            raise Http404
        if klass == Equipment:
            return EquipmentFactory.build(user=user)
        raise Exception(f"unexpected class: {klass}")

    mocker.patch(
        "main.views.equipment_unlink.get_object_or_404", new=fake_get_object_or_404
    )
    response = equipment_unlink(request, 1, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_equipment_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(
        reverse("equipment_unlink", kwargs={"equipment_id": 1, "recipe_id": 1})
    )
    user = UserFactory.build()
    authenticate(request, user)

    def fake_get_object_or_404(klass, *args, **kwargs):  # type: ignore[no-untyped-def]
        if klass == Recipe:
            return RecipeFactory.build(user=user)
        if klass == Equipment:
            raise Http404
        raise Exception(f"unexpected class: {klass}")

    mocker.patch(
        "main.views.equipment_unlink.get_object_or_404", new=fake_get_object_or_404
    )
    response = equipment_unlink(request, 1, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


@pytest.mark.django_db()
def test_equipment_unlinked_from_recipe(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    equipment = EquipmentFactory.create(user=user)
    recipe = RecipeFactory.create(user=user)
    recipe.equipment.add(equipment)
    request = api_rf.post(
        reverse(
            "equipment_unlink",
            kwargs={"equipment_id": equipment.id, "recipe_id": recipe.id},
        )
    )
    authenticate(request, user)
    response = equipment_unlink(request, recipe.id, equipment.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    recipe.refresh_from_db()
    assert not recipe.equipment.contains(equipment)
