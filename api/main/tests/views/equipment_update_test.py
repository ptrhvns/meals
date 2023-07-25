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

from main.tests.factories import EquipmentFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.equipment_update import equipment_update


def test_http_method_names() -> None:
    assert sets_http_method_names(equipment_update, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(equipment_update, permission_classes)


def test_equipment_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("equipment_update", kwargs={"equipment_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.equipment_update.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = equipment_update(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("equipment_update", kwargs={"equipment_id": 1}), {})
    user = UserFactory.build()
    authenticate(request, user)
    equipment = EquipmentFactory.build()
    mocker.patch(
        "main.views.equipment_update.get_object_or_404",
        autospec=True,
        return_value=equipment,
    )
    response = equipment_update(request, 1)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


def test_new_description_same_as_old(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    description = "spatula"
    request = api_rf.post(
        reverse("equipment_update", kwargs={"equipment_id": 1}),
        {"description": description},
    )
    user = UserFactory.build()
    authenticate(request, user)
    equipment = EquipmentFactory.build(description=description)
    mocker.patch(
        "main.views.equipment_update.get_object_or_404",
        autospec=True,
        return_value=equipment,
    )
    response = equipment_update(request, 1)
    assert response.status_code == HTTP_204_NO_CONTENT


@pytest.mark.django_db()
def test_new_description_already_taken(api_rf: APIRequestFactory) -> None:
    taken_description = "spatula"
    user = UserFactory.create()
    EquipmentFactory.create(description=taken_description, user=user)
    equipment = EquipmentFactory.create(description="spoon", user=user)
    request = api_rf.post(
        reverse("equipment_update", kwargs={"equipment_id": equipment.id}),
        {"description": taken_description},
    )
    authenticate(request, user)
    response = equipment_update(request, equipment.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_updated_equipment_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    equipment = EquipmentFactory.create(description="old description", user=user)
    request = api_rf.post(
        reverse("equipment_update", kwargs={"equipment_id": equipment.id}),
        {"description": "new description"},
    )
    authenticate(request, user)
    response = equipment_update(request, equipment.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    equipment.refresh_from_db()
    assert equipment.description == "new description"
