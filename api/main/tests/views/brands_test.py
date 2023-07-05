from collections.abc import Mapping
from json import dumps, loads

import pytest
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK
from rest_framework.test import APIRequestFactory

from main.tests.factories import BrandFactory, UserFactory
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.brands import brands


def test_http_method_names() -> None:
    assert sets_http_method_names(brands, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(brands, permission_classes)


@pytest.mark.django_db()
def test_get_brands_with_no_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("brands"))
    authenticate(request, user)
    brands_instances = BrandFactory.create_batch(size=20, user=user)
    response = brands(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["brands"] = sorted(data["brands"], key=key)
    assert data == {
        "brands": sorted(
            [{"id": b.id, "name": b.name} for b in brands_instances], key=key
        ),
    }


@pytest.mark.django_db()
def test_get_brands_with_page_number(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    request = api_rf.get(reverse("brands"), {"page": 2})
    authenticate(request, user)
    brands_instances = BrandFactory.create_batch(size=20, user=user)
    response = brands(request)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data["data"]))  # type: ignore[index]

    def key(r: Mapping[str, str]) -> str:
        return r["id"]

    data["brands"] = sorted(data["brands"], key=key)
    assert data == {
        "pagination": {
            "page": 2,
            "total": 2,
        },
        "brands": sorted(
            [{"id": b.id, "name": b.name} for b in brands_instances], key=key
        )[
            10:  # 20 total, 10 per page
        ],
    }
