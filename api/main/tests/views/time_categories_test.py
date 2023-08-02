from collections.abc import Mapping
from json import dumps, loads

import pytest
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK
from rest_framework.test import APIRequestFactory

from main.tests.factories import TimeCategoryFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.time_categories import time_categories


def test_http_method_names() -> None:
    assert sets_http_method_names(time_categories, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(time_categories, permission_classes)


@pytest.mark.django_db()
def test_get_tag_with_no_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("time_categories"))
    authenticate(request, user)
    time_category_models = TimeCategoryFactory.create_batch(size=15, user=user)
    response = time_categories(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["timeCategories"] = sorted(data["timeCategories"], key=key)
    assert data == {
        "timeCategories": sorted(
            [{"id": t.id, "name": t.name} for t in time_category_models], key=key
        ),
    }


@pytest.mark.django_db()
def test_get_tag_with_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("time_categories"), {"page": 2})
    authenticate(request, user)
    time_category_models = TimeCategoryFactory.create_batch(size=15, user=user)
    response = time_categories(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["timeCategories"] = sorted(data["timeCategories"], key=key)
    assert data == {
        "pagination": {
            "page": 2,
            "total": 2,
        },
        "timeCategories": sorted(
            [{"id": t.id, "name": t.name} for t in time_category_models], key=key
        )[10:],
    }
