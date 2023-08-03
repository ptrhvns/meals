from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import RecipeFactory, TimeFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.time_destroy import time_destroy


def test_http_method_names() -> None:
    assert sets_http_method_names(time_destroy, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(time_destroy, permission_classes)


def test_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    time_id = 1
    request = api_rf.post(reverse("time_destroy", kwargs={"time_id": time_id}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.time_destroy.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = time_destroy(request, time_id)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_destroyed_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.build()
    recipe = RecipeFactory.build(id=1, user=user)
    time = TimeFactory.build(id=1, recipe=recipe)
    request = api_rf.post(reverse("time_destroy", kwargs={"time_id": time.id}))
    authenticate(request, user)
    mocker.patch.object(time, "delete")
    mocker.patch(
        "main.views.time_destroy.get_object_or_404", autospec=True, return_value=time
    )
    response = time_destroy(request, time.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    assert time.delete.called
