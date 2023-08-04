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

from main.tests.factories import UnitFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.unit_update import unit_update


def test_http_method_names() -> None:
    assert sets_http_method_names(unit_update, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(unit_update, permission_classes)


def test_unit_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    unit_id = 1
    request = api_rf.post(reverse("unit_update", kwargs={"unit_id": unit_id}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.unit_update.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = unit_update(request, unit_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    unit_id = 1
    request = api_rf.post(reverse("unit_update", kwargs={"unit_id": unit_id}), {})
    user = UserFactory.build()
    authenticate(request, user)
    unit = UnitFactory.build(name="cup")
    mocker.patch(
        "main.views.unit_update.get_object_or_404",
        autospec=True,
        return_value=unit,
    )
    response = unit_update(request, unit_id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


def test_new_name_same_as_old_name(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    unit_id = 1
    name = "cup"
    request = api_rf.post(
        reverse("unit_update", kwargs={"unit_id": unit_id}), {"name": name}
    )
    user = UserFactory.build()
    authenticate(request, user)
    unit = UnitFactory.build(name=name)
    mocker.patch(
        "main.views.unit_update.get_object_or_404",
        autospec=True,
        return_value=unit,
    )
    response = unit_update(request, unit_id)
    assert response.status_code == HTTP_204_NO_CONTENT


@pytest.mark.django_db()
def test_new_name_already_taken(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    taken_name = "TakenName"
    UnitFactory.create(name=taken_name, user=user)
    unit = UnitFactory.create(name="OldName", user=user)
    request = api_rf.post(
        reverse("unit_update", kwargs={"unit_id": unit.id}), {"name": taken_name}
    )
    authenticate(request, user)
    response = unit_update(request, unit.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_updated_unit_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    unit = UnitFactory.create(name="OldName", user=user)
    new_name = "NewName"
    request = api_rf.post(
        reverse("unit_update", kwargs={"unit_id": unit.id}), {"name": new_name}
    )
    authenticate(request, user)
    response = unit_update(request, unit.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    unit.refresh_from_db()
    assert unit.name == new_name
