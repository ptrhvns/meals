from datetime import datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from django.conf import settings
from factory import LazyAttribute, Sequence, post_generation  # type: ignore[import]
from factory.django import DjangoModelFactory  # type: ignore[import]

from main.models.brand import Brand
from main.models.direction import Direction
from main.models.email_confirmation_token import EmailConfirmationToken
from main.models.equipment import Equipment
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.recipe import Recipe
from main.models.tag import Tag
from main.models.time import Time
from main.models.time_category import TimeCategory
from main.models.unit import Unit
from main.models.user import User


class BrandFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Brand

    name = Sequence(lambda n: f"Brand{n + 1}")


class DirectionFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Direction

    description = Sequence(lambda n: f"Take action #{n + 1}.")


class EmailConfirmationTokenFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = EmailConfirmationToken

    expiration = LazyAttribute(  # type: ignore[misc]
        lambda _: datetime.now(tz=ZoneInfo(settings.TIME_ZONE)) + timedelta(hours=1)
    )


class EquipmentFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Equipment

    description = Sequence(lambda n: f"Equipment #{n + 1}")


class FoodFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Food

    name = Sequence(lambda n: f"Food{n + 1}")


class IngredientFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Ingredient

    order = Sequence(lambda n: n)


class RecipeFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Recipe

    title = Sequence(lambda n: f"Recipe{n + 1}")


class TagFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Tag

    name = Sequence(lambda n: f"Tag{n + 1}")


class TimeFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Time

    minutes = Sequence(lambda n: n + 1)


class TimeCategoryFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = TimeCategory

    name = Sequence(lambda n: f"TimeCategory{n + 1}")


# XXX: consider using main.models.User.create_user() instead.
class UserFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = User

    email = LazyAttribute(lambda u: f"{u.username}@example.com")  # type: ignore[misc]
    is_active = True
    username = Sequence(lambda n: f"user{n + 1}")

    @post_generation  # type: ignore[misc]
    def password(obj: Any, create, extracted, **kwargs):  # type: ignore[no-untyped-def] # noqa: N805
        if extracted:
            obj.set_password(extracted)


class UnitFactory(DjangoModelFactory):  # type: ignore[type-arg]
    class Meta:
        model = Unit

    name = Sequence(lambda n: f"Unit{n + 1}")
