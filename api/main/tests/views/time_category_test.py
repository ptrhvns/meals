from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import TimeCategoryFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.time_category import time_category


def test_http_method_names() -> None:
    assert sets_http_method_names(time_category, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(time_category, permission_classes)


def test_time_category_not_found(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    time_category_id = 1
    request = api_rf.get(
        reverse("time_category", kwargs={"time_category_id": time_category_id})
    )
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.time_category.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = time_category(request, time_category_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_getting_time_category_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    time_category_id = 1
    request = api_rf.get(
        reverse("time_category", kwargs={"time_category_id": time_category_id})
    )
    user = UserFactory.build()
    authenticate(request, user)
    time_category_model = TimeCategoryFactory.build(id=time_category_id)
    mocker.patch(
        "main.views.time_category.get_object_or_404",
        autospec=True,
        return_value=time_category_model,
    )
    response = time_category(request, time_category_id)
    assert response.status_code == HTTP_200_OK
    assert response.data["data"]["timeCategory"]["name"] == time_category_model.name  # type: ignore[index]
