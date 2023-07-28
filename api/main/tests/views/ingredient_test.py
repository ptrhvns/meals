from json import dumps, loads

from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import (
    BrandFactory,
    FoodFactory,
    IngredientFactory,
    RecipeFactory,
    UnitFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.ingredient import ingredient


def test_http_method_names() -> None:
    assert sets_http_method_names(ingredient, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(ingredient, permission_classes)


def test_ingredient_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.get(reverse("ingredient", kwargs={"ingredient_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.ingredient.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = ingredient(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_getting_ingredient_successfully(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.get(reverse("ingredient", kwargs={"ingredient_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    amount = 2
    brand = BrandFactory.build(id=1, user=user)
    food = FoodFactory.build(id=1, user=user)
    note = "This is a note."
    unit = UnitFactory.build(id=1, user=user)
    ing = IngredientFactory.build(
        id=1,
        amount=amount,
        brand=brand,
        food=food,
        note=note,
        recipe=RecipeFactory.build(user=user),
        unit=unit,
    )
    mocker.patch(
        "main.views.ingredient.get_object_or_404", autospec=True, return_value=ing
    )
    response = ingredient(request, ing.id)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data))
    assert data == {
        "data": {
            "ingredient": {
                "amount": f"{amount:0.2f}",
                "brand": {"id": brand.id, "name": brand.name},
                "food": {"id": food.id, "name": food.name},
                "id": ing.id,
                "note": note,
                "order": 0,
                "unit": {"id": unit.id, "name": unit.name},
            },
        },
    }
