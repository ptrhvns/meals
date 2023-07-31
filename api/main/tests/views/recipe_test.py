from json import dumps, loads

import pytest
from django.http import Http404
from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from rest_framework.test import APIRequestFactory

from main.tests.factories import (
    BrandFactory,
    DirectionFactory,
    EquipmentFactory,
    FoodFactory,
    IngredientFactory,
    RecipeFactory,
    TagFactory,
    TimeCategoryFactory,
    TimeFactory,
    UnitFactory,
    UserFactory,
)
from main.tests.support.drf_view_helpers import (
    sets_http_method_names,
    sets_permission_classes,
)
from main.tests.support.request_helpers import authenticate
from main.views.recipe import recipe


def test_http_method_names() -> None:
    assert sets_http_method_names(recipe, ["get", "options"])


def test_permission_classes() -> None:
    permission_classes = [IsAuthenticated]
    assert sets_permission_classes(recipe, permission_classes)


def test_recipe_not_found(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.get(reverse("recipe", kwargs={"recipe_id": 1}))
    user = UserFactory.build()
    authenticate(request, user)
    mocker.patch(
        "main.views.recipe.get_object_or_404",
        autospec=True,
        side_effect=Http404,
    )
    response = recipe(request, 1)
    assert response.status_code == HTTP_404_NOT_FOUND


@pytest.mark.django_db()
def test_get_successfully(api_rf: APIRequestFactory, mocker: MockerFixture) -> None:
    request = api_rf.get(reverse("recipe", kwargs={"recipe_id": 1}))
    user = UserFactory.create()
    authenticate(request, user)
    recipe_model = RecipeFactory.create(
        notes="This is a note.",
        rating=3,
        servings=4,
        title="Biscuits",
        user=user,
    )
    direction = DirectionFactory.create(recipe=recipe_model)
    equipment = EquipmentFactory.create(user=user)
    recipe_model.equipment.add(equipment)
    brand = BrandFactory.create(user=user)
    food = FoodFactory.create(user=user)
    unit = UnitFactory.create(user=user)
    ingredient = IngredientFactory.create(
        amount=4,
        brand=brand,
        food=food,
        note="This is an ingredient note.",
        recipe=recipe_model,
        unit=unit,
    )
    tag = TagFactory.create(user=user)
    recipe_model.tags.add(tag)
    time_category = TimeCategoryFactory.create(user=user)
    time = TimeFactory.create(
        days=1,
        hours=1,
        minutes=1,
        recipe=recipe_model,
        time_category=time_category,
    )
    mocker.patch(
        "main.views.recipe.get_object_or_404", autospec=True, return_value=recipe_model
    )
    response = recipe(request, recipe_model.id)
    assert response.status_code == HTTP_200_OK
    data = loads(dumps(response.data))
    assert data == {
        "data": {
            "recipe": {
                "directions": [
                    {
                        "description": direction.description,
                        "id": direction.id,
                        "order": direction.order,
                    },
                ],
                "equipment": [
                    {"description": equipment.description, "id": equipment.id}
                ],
                "id": recipe_model.id,
                "ingredients": [
                    {
                        "amount": f"{ingredient.amount:0.2f}",
                        "brand": {"id": brand.id, "name": brand.name},
                        "food": {"id": food.id, "name": food.name},
                        "id": ingredient.id,
                        "note": ingredient.note,
                        "order": ingredient.order,
                        "unit": {"id": unit.id, "name": unit.name},
                    },
                ],
                "notes": recipe_model.notes,
                "rating": recipe_model.rating,
                "servings": f"{recipe_model.servings:0.2f}",
                "tags": [{"id": tag.id, "name": tag.name}],
                "times": [
                    {
                        "days": time.days,
                        "hours": time.hours,
                        "id": time.id,
                        "minutes": time.minutes,
                        "note": "",
                        "time_category": {
                            "id": time_category.id,
                            "name": time_category.name,
                        },
                    },
                ],
                "title": recipe_model.title,
            },
        },
    }
