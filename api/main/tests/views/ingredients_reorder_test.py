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
from main.views.ingredients_reorder import ingredients_reorder


def test_http_method_names() -> None:
    assert sets_http_method_names(ingredients_reorder, ["options", "post"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(ingredients_reorder, permission_classes)


def test_ingredients_not_found(
    api_rf: APIRequestFactory, mocker: MockerFixture
) -> None:
    request = api_rf.post(reverse("ingredients_reorder"), {"ingredients": []})
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.ingredients_reorder.get_list_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = ingredients_reorder(request)
    assert response.status_code == HTTP_404_NOT_FOUND


def test_invalid_request_data(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.post(reverse("ingredients_reorder"), {"ingredients": [{"id": 1}]})
    user = UserFactory.build()
    authenticate(request, user)
    recipe = RecipeFactory.build(user=user)
    ingredients = []
    for _ in range(3):
        ingredients.append(
            IngredientFactory.build(food=FoodFactory.build(user=user), recipe=recipe)
        )
    mocker.patch(
        "main.views.ingredients_reorder.get_list_or_404",
        autospec=True,
        return_value=ingredients,
    )
    response = ingredients_reorder(request)
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.django_db()
def test_reorder_succesfully(api_rf: APIRequestFactory) -> None:
    user = UserFactory.create()
    request = api_rf.post(
        reverse("ingredients_reorder"),
        {
            "ingredients": [
                {"id": 1, "order": 2},
                {"id": 2, "order": 3},
                {"id": 3, "order": 1},
            ]
        },
    )
    authenticate(request, user)
    recipe = RecipeFactory.create(user=user)
    IngredientFactory.create(
        id=1, food=FoodFactory.create(user=user), order=1, recipe=recipe
    )
    IngredientFactory.create(
        id=2, food=FoodFactory.create(user=user), order=2, recipe=recipe
    )
    IngredientFactory.create(
        id=3, food=FoodFactory.create(user=user), order=3, recipe=recipe
    )
    response = ingredients_reorder(request)
    assert response.status_code == HTTP_204_NO_CONTENT
    assert Ingredient.objects.filter(id=1, order=2).exists()
    assert Ingredient.objects.filter(id=2, order=3).exists()
    assert Ingredient.objects.filter(id=3, order=1).exists()
