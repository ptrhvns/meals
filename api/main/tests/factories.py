from random import randrange
from typing import Any

from factory import LazyAttribute, Sequence, post_generation  # type: ignore[import]
from factory.django import DjangoModelFactory  # type: ignore[import]

from main.models.brand import Brand
from main.models.direction import Direction
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.recipe import Recipe
from main.models.user import User


class BrandFactory(DjangoModelFactory):  # type: ignore[misc]
    class Meta:
        model = Brand

    name = Sequence(lambda n: f"Brand{n + 1}")


class DirectionFactory(DjangoModelFactory):  # type: ignore[misc]
    class Meta:
        model = Direction

    description = Sequence(lambda n: f"Take action #{n + 1}.")


class FoodFactory(DjangoModelFactory):  # type: ignore[misc]
    class Meta:
        model = Food

    name = Sequence(lambda n: f"Food{n + 1}")


class IngredientFactory(DjangoModelFactory):  # type: ignore[misc]
    class Meta:
        model = Ingredient

    amount = LazyAttribute(lambda i: randrange(10))  # noqa: S311


class RecipeFactory(DjangoModelFactory):  # type: ignore[misc]
    class Meta:
        model = Recipe

    title = Sequence(lambda n: f"Recipe{n + 1}")


# XXX: consider using main.models.User.create_user() instead.
class UserFactory(DjangoModelFactory):  # type: ignore[misc]
    class Meta:
        model = User

    email = LazyAttribute(lambda u: f"{u.username}@example.com")
    is_active = True
    username = Sequence(lambda n: f"user{n + 1}")

    @post_generation  # type: ignore[misc]
    def password(obj: Any, create, extracted, **kwargs):  # type: ignore[no-untyped-def] # noqa: N805
        if extracted:
            obj.set_password(extracted)
