from contextlib import nullcontext

from django.db import Error
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.test import APIRequestFactory

from main.models.equipment import Equipment
from main.tests.factories import EquipmentFactory, RecipeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.equipment_link import equipment_link


def test_http_method_names() -> None:
    assert sets_http_method_names(equipment_link, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(equipment_link, permission_classes)


def test_recipe_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("equipment_link", kwargs={"recipe_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.equipment_link.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = equipment_link(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("equipment_link", kwargs={"recipe_id": 1}), {})
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user)
    mocker.patch(
        "main.views.equipment_link.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    response = equipment_link(request, 1)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


def test_gets_existing_equipment(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.post(
        reverse("equipment_link", kwargs={"recipe_id": 1}),
        {"description": "description"},
    )
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user)
    mocker.patch(
        "main.views.equipment_link.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    mocker.patch(
        "main.views.equipment_link.atomic", autospec=True, return_value=nullcontext()
    )
    recipes = mocker.PropertyMock()
    mocker.patch.object(Equipment, "recipes", return_value=recipes)
    mocker.patch.object(Equipment.recipes, "contains", return_value=False)
    add_mock = mocker.patch.object(Equipment.recipes, "add")
    equipment = EquipmentFactory.build(id=1, user=user)
    mocker.patch(
        "main.views.equipment_link.Equipment.objects.get_or_create",
        autospec=True,
        return_value=[equipment, False],
    )
    response = equipment_link(request, 1)
    assert response.status_code == HTTP_200_OK
    assert add_mock.called


def test_existing_equipment_already_linked_to_recipe(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.post(
        reverse("equipment_link", kwargs={"recipe_id": 1}),
        {"description": "description"},
    )
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user)
    mocker.patch(
        "main.views.equipment_link.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    mocker.patch(
        "main.views.equipment_link.atomic", autospec=True, return_value=nullcontext()
    )
    recipes = mocker.PropertyMock()
    mocker.patch.object(Equipment, "recipes", return_value=recipes)
    mocker.patch.object(Equipment.recipes, "contains", return_value=True)
    add_mock = mocker.patch.object(Equipment.recipes, "add")
    equipment = EquipmentFactory.build(id=1, user=user)
    mocker.patch(
        "main.views.equipment_link.Equipment.objects.get_or_create",
        autospec=True,
        return_value=[equipment, False],
    )
    response = equipment_link(request, recipe.id)
    assert response.status_code == HTTP_200_OK
    assert not add_mock.called


def test_creates_new_equipment(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.post(
        reverse("equipment_link", kwargs={"recipe_id": 1}),
        {"description": "description"},
    )
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user)
    mocker.patch(
        "main.views.equipment_link.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    mocker.patch(
        "main.views.equipment_link.atomic", autospec=True, return_value=nullcontext()
    )
    recipes = mocker.PropertyMock()
    mocker.patch.object(Equipment, "recipes", return_value=recipes)
    mocker.patch.object(Equipment.recipes, "contains", return_value=True)
    equipment = EquipmentFactory.build(id=1, user=user)
    mocker.patch(
        "main.views.equipment_link.Equipment.objects.get_or_create",
        autospec=True,
        return_value=[equipment, True],
    )
    response = equipment_link(request, 1)
    assert response.status_code == HTTP_201_CREATED


def test_creation_of_new_equipment_fails(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.build()
    request = api_rf.post(
        reverse("equipment_link", kwargs={"recipe_id": 1}),
        {"description": "description"},
    )
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user)
    mocker.patch(
        "main.views.equipment_link.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    mocker.patch(
        "main.views.equipment_link.atomic", autospec=True, return_value=nullcontext()
    )
    mocker.patch(
        "main.views.equipment_link.Equipment.objects.get_or_create",
        autospec=True,
        side_effect=Error(),
    )
    response = equipment_link(request, recipe.id)
    assert response.status_code == HTTP_500_INTERNAL_SERVER_ERROR
    assert len(response.data["message"]) > 0  # type: ignore[index]
