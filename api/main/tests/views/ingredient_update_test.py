import pytest
from django.db import Error
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
from main.views.ingredient_update import ingredient_update


def test_http_method_names() -> None:
    assert sets_http_method_names(ingredient_update, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(ingredient_update, permission_classes)


def test_ingredient_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("ingredient_update", kwargs={"ingredient_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.ingredient_update.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = ingredient_update(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    ingredient_id = 1
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient_id}), {}
    )
    user = UserFactory.build()
    authenticate(request, user)
    ingredient = IngredientFactory.build(
        id=ingredient_id, food=FoodFactory.build(user=user)
    )
    mocker.patch(
        "main.views.ingredient_update.get_object_or_404",
        autospec=True,
        return_value=ingredient,
    )
    response = ingredient_update(request, ingredient_id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_updates_ingredient_with_existing_food(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    recipe = RecipeFactory.create(user=user)
    ingredient = IngredientFactory.create(food=food, recipe=recipe)
    new_food_name = "new_food"
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"food": new_food_name},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    ingredient.refresh_from_db()
    assert new_food_name == ingredient.food.name


@pytest.mark.django_db()
def test_creates_ingredient_with_new_food(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    ingredient = IngredientFactory.create(
        food=FoodFactory.create(user=user), recipe=RecipeFactory.create(user=user)
    )
    new_food_name = "new_food"
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"food": new_food_name},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    ingredient.refresh_from_db()
    assert new_food_name == ingredient.food.name


@pytest.mark.django_db()
def test_updates_ingredient_with_amount_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    ingredient = IngredientFactory.create(
        food=food, recipe=RecipeFactory.create(user=user)
    )
    amount = 2
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"amount": amount, "food": food.name},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    ingredient.refresh_from_db()
    assert amount == ingredient.amount


@pytest.mark.django_db()
def test_updates_ingredient_with_existing_brand_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    ingredient = IngredientFactory.create(
        food=food, recipe=RecipeFactory.create(user=user)
    )
    brand = BrandFactory.create(user=user)
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"brand": brand.name, "food": food.name},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    ingredient.refresh_from_db()
    assert brand.name == ingredient.brand.name


@pytest.mark.django_db()
def test_updates_ingredient_with_new_brand_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    ingredient = IngredientFactory.create(
        food=food, recipe=RecipeFactory.create(user=user)
    )
    brand_name = "NewBrand"
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"brand": brand_name, "food": food.name},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    ingredient.refresh_from_db()
    assert brand_name == ingredient.brand.name


@pytest.mark.django_db()
def test_updates_ingredient_with_existing_unit_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    ingredient = IngredientFactory.create(
        food=food, recipe=RecipeFactory.create(user=user)
    )
    unit = UnitFactory.create(user=user)
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"food": food.name, "unit": unit.name},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    ingredient.refresh_from_db()
    assert unit.name == ingredient.unit.name


@pytest.mark.django_db()
def test_updates_ingredient_with_new_unit_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    ingredient = IngredientFactory.create(
        food=food, recipe=RecipeFactory.create(user=user)
    )
    unit_name = "NewUnit"
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"food": food.name, "unit": unit_name},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    ingredient.refresh_from_db()
    assert unit_name == ingredient.unit.name


@pytest.mark.django_db()
def test_updates_ingredient_with_note_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    ingredient = IngredientFactory.create(
        food=food, recipe=RecipeFactory.create(user=user)
    )
    note = "This is a note."
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"food": food.name, "note": note},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_204_NO_CONTENT
    ingredient.refresh_from_db()
    assert note == ingredient.note


@pytest.mark.django_db()
def test_empty_string_fields_are_eliminated(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    ingredient = IngredientFactory.create(
        food=food, recipe=RecipeFactory.create(user=user)
    )
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"amount": "", "brand": "", "food": food.name, "note": "", "unit": ""},
    )
    authenticate(request, user)
    ingredient_update(request, ingredient.id)
    ingredient.refresh_from_db()
    assert ingredient.amount is None
    assert ingredient.brand is None
    assert not ingredient.note
    assert ingredient.unit is None


@pytest.mark.django_db()
def test_ingredient_update_fails(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    food = FoodFactory.create(user=user)
    ingredient = IngredientFactory.create(
        food=food, recipe=RecipeFactory.create(user=user)
    )
    mocker.patch.object(
        ingredient,
        "save",
        autospec=True,
        side_effect=Error,
    )
    mocker.patch(
        "main.views.ingredient_update.get_object_or_404",
        autospec=True,
        return_value=ingredient,
    )
    request = api_rf.post(
        reverse("ingredient_update", kwargs={"ingredient_id": ingredient.id}),
        {"food": food.name},
    )
    authenticate(request, user)
    response = ingredient_update(request, ingredient.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["message"]) > 0  # type: ignore[index]
