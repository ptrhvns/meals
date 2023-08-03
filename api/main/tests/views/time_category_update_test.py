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

from main.tests.factories import TimeCategoryFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.time_category_update import time_category_update


def test_http_method_names() -> None:
    assert sets_http_method_names(time_category_update, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(time_category_update, permission_classes)


def test_time_category_not_found(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    time_category_id = 1
    request = api_rf.post(
        reverse("time_category_update", kwargs={"time_category_id": time_category_id})
    )
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.time_category_update.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = time_category_update(request, time_category_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    time_category_id = 1
    request = api_rf.post(
        reverse("time_category_update", kwargs={"time_category_id": time_category_id}),
        {},
    )
    user = UserFactory.build()
    authenticate(request, user)
    time_category = TimeCategoryFactory.build()
    mocker.patch(
        "main.views.time_category_update.get_object_or_404",
        autospec=True,
        return_value=time_category,
    )
    response = time_category_update(request, time_category_id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


def test_new_name_same_as_old_name(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    time_category_id = 1
    name = "cook"
    request = api_rf.post(
        reverse("time_category_update", kwargs={"time_category_id": time_category_id}),
        {"name": name},
    )
    user = UserFactory.build()
    authenticate(request, user)
    time_category = TimeCategoryFactory.build(name=name)
    mocker.patch(
        "main.views.time_category_update.get_object_or_404",
        autospec=True,
        return_value=time_category,
    )
    response = time_category_update(request, time_category_id)
    assert response.status_code == HTTP_204_NO_CONTENT


@pytest.mark.django_db()
def test_new_name_already_taken(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    taken_name = "TakenName"
    TimeCategoryFactory.create(name=taken_name, user=user)
    time_category = TimeCategoryFactory.create(name="OldName", user=user)
    request = api_rf.post(
        reverse("time_category_update", kwargs={"time_category_id": time_category.id}),
        {"name": taken_name},
    )
    authenticate(request, user)
    response = time_category_update(request, time_category.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_updated_time_category_successfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    time_category = TimeCategoryFactory.create(name="OldName", user=user)
    new_name = "NewName"
    request = api_rf.post(
        reverse("time_category_update", kwargs={"time_category_id": time_category.id}),
        {"name": new_name},
    )
    authenticate(request, user)
    response = time_category_update(request, time_category.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    time_category.refresh_from_db()
    assert time_category.name == new_name
