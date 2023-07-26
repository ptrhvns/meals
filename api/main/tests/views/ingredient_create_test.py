import pytest
from django.db import Error
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
)
from rest_framework.test import APIRequestFactory

from main.models.ingredient import Ingredient
from main.tests.factories import (
    FoodFactory,
    IngredientFactory,
    RecipeFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.ingredient_create import ingredient_create


def test_http_method_names() -> None:
    assert sets_http_method_names(ingredient_create, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(ingredient_create, permission_classes)


def test_recipe_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("ingredient_create", kwargs={"recipe_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.ingredient_create.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = ingredient_create(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    recipe_id = 1
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe_id}), {}
    )
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user, id=recipe_id)
    mocker.patch(
        "main.views.ingredient_create.get_object_or_404",
        autospec=True,
        return_value=recipe,
    )
    response = ingredient_create(request, recipe_id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["errors"]) > 0  # type: ignore[index]
    assert len(response.data["message"]) > 0  # type: ignore[index]


@pytest.mark.django_db()
def test_creates_ingredient_with_existing_food(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    food = FoodFactory.create(user=user)
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"food": food.name},
    )
    authenticate(request, user)
    response = ingredient_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    count = Ingredient.objects.filter(food__name=food.name, recipe=recipe).count()
    assert count == 1


@pytest.mark.django_db()
def test_creates_ingredient_with_new_food(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    food = "banana"
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"food": food},
    )
    authenticate(request, user)
    response = ingredient_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    count = Ingredient.objects.filter(food__name=food, recipe=recipe).count()
    assert count == 1


@pytest.mark.django_db()
def test_creates_ingredient_with_amount_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    food = "banana"
    amount = 2
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"amount": amount, "food": food},
    )
    authenticate(request, user)
    response = ingredient_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    count = Ingredient.objects.filter(
        amount=amount, food__name=food, recipe=recipe
    ).count()
    assert count == 1


@pytest.mark.django_db()
def test_creates_ingredient_with_brand_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    food = "banana"
    brand = "Acme"
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"brand": brand, "food": food},
    )
    authenticate(request, user)
    response = ingredient_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    count = Ingredient.objects.filter(
        brand__name=brand, food__name=food, recipe=recipe
    ).count()
    assert count == 1


@pytest.mark.django_db()
def test_creates_ingredient_with_unit_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    food = "banana"
    unit = "cup"
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"food": food, "unit": unit},
    )
    authenticate(request, user)
    response = ingredient_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    count = Ingredient.objects.filter(
        food__name=food, recipe=recipe, unit__name=unit
    ).count()
    assert count == 1


@pytest.mark.django_db()
def test_creates_ingredient_with_note_when_in_request(
    api_rf: APIRequestFactory,
) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    food = "banana"
    note = "This is a note."
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"food": food, "note": note},
    )
    authenticate(request, user)
    response = ingredient_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    count = Ingredient.objects.filter(food__name=food, note=note, recipe=recipe).count()
    assert count == 1


@pytest.mark.django_db()
def test_creates_ingredient_with_order_set_to_last(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    size = 3
    for order in range(size):
        IngredientFactory.create(
            food=FoodFactory.create(user=user),
            order=order,
            recipe=recipe,
        )
    food = "banana"
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"food": food},
    )
    authenticate(request, user)
    response = ingredient_create(request, recipe.id)
    assert response.status_code == HTTP_201_CREATED
    ingredient = Ingredient.objects.get(food__name=food, recipe=recipe)
    assert ingredient.order == size  # order is zero based


@pytest.mark.django_db()
def test_empty_string_fields_are_eliminated(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    food = "banana"
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"amount": "", "brand": "", "food": food, "note": "", "unit": ""},
    )
    authenticate(request, user)
    ingredient_create(request, recipe.id)
    ingredient = Ingredient.objects.get(food__name=food, recipe=recipe)
    assert ingredient.amount is None
    assert ingredient.brand is None
    assert not ingredient.note
    assert ingredient.unit is None


@pytest.mark.django_db()
def test_ingredient_creation_fails(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    user = UserFactory.create()
    recipe = RecipeFactory.create(user=user)
    food = "banana"
    request = api_rf.post(
        reverse("ingredient_create", kwargs={"recipe_id": recipe.id}),
        {"amount": "", "brand": "", "food": food, "note": "", "unit": ""},
    )
    authenticate(request, user)
    mocker.patch(
        "main.views.ingredient_create.Ingredient.objects.create",
        autospec=True,
        side_effect=Error,
    )
    response = ingredient_create(request, recipe.id)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    assert len(response.data["message"]) > 0  # type: ignore[index]
