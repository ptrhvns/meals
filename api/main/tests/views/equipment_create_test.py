from django.db import Error
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.test import APIRequestFactory

from main.tests.factories import UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.equipment_create import equipment_create


def test_http_method_names() -> None:
    assert sets_http_method_names(equipment_create, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(equipment_create, permission_classes)


def test_invalid_request_data(api_rf: APIRequestFactory) -> None:
    request = api_rf.post(reverse("equipment_create"), {})
    user = UserFactory.build()
    authenticate(request, user)
    response = equipment_create(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


def test_gets_existing_equipment(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.post(reverse("equipment_create"), {"description": "description"})
    user = UserFactory.build()
    authenticate(request, user)
    mock = mocker.patch(
        "main.views.equipment_create.Equipment.objects.get_or_create",
        autospec=True,
        return_value=[False],
    )
    response = equipment_create(request)
    assert response.status_code == HTTP_200_OK
    mock.assert_called()


def test_creates_equipment(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("equipment_create"), {"description": "description"})
    user = UserFactory.build()
    authenticate(request, user)
    mock = mocker.patch(
        "main.views.equipment_create.Equipment.objects.get_or_create",
        autospec=True,
        return_value=[True],
    )
    response = equipment_create(request)
    assert response.status_code == HTTP_201_CREATED
    mock.assert_called()


def test_creation_fails(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("equipment_create"), {"description": "description"})
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.equipment_create.Equipment.objects.get_or_create",
        autospec=True,
        side_effect=Error(),
    )
    response = equipment_create(request)
    assert response.status_code == HTTP_500_INTERNAL_SERVER_ERROR
    assert len(response.data["message"]) > 0  # type: ignore[index]
