from __future__ import annotations

from django.core import exceptions
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Deferrable  # type: ignore[attr-defined]
from django.db.models import (
    CASCADE,
    SET_NULL,
    CharField,
    DecimalField,
    ForeignKey,
    ManyToManyField,
    Model,
    PositiveIntegerField,
    PositiveSmallIntegerField,
    TextField,
    UniqueConstraint,
)
from django.utils.translation import gettext_lazy

from accounts.models import User


class Recipe(Model):
    notes = TextField(blank=True)
    rating = PositiveSmallIntegerField(
        blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    servings = DecimalField(
        blank=True,
        decimal_places=2,
        max_digits=6,
        null=True,
        validators=[MinValueValidator(0)],
    )
    title = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(User, on_delete=CASCADE, related_name="recipes")

    def __str__(self) -> str:
        return self.title


class Tag(Model):
    name = CharField(max_length=256)
    recipes: ManyToManyField[Recipe, Tag] = ManyToManyField(Recipe, related_name="tags")
    user: ForeignKey[User] = ForeignKey(
        User, blank=False, null=False, on_delete=CASCADE, related_name="tags"
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["name", "user"],
                name="recipes_tag_unique_name_user",
            )
        ]

    def __str__(self) -> str:
        return self.name


class Time(Model):
    days = PositiveIntegerField(blank=True, null=True)
    hours = PositiveIntegerField(blank=True, null=True)
    minutes = PositiveIntegerField(blank=True, null=True)
    note = CharField(blank=True, default="", max_length=64)
    recipe = ForeignKey(Recipe, on_delete=CASCADE, related_name="times")
    time_category: ForeignKey[TimeCategory] = ForeignKey(
        "TimeCategory", on_delete=CASCADE, related_name="times"
    )

    def __str__(self) -> str:
        d = f"{self.days}d" if self.days else None
        h = f"{self.hours}h" if self.hours else None
        m = f"{self.minutes}m" if self.minutes else None
        times = " ".join([t for t in [d, h, m] if t])
        return f"{self.time_category.name} {times}"

    def clean(self) -> None:
        units = ["days", "hours", "minutes"]

        if not any([getattr(self, u) for u in units]):
            error = gettext_lazy("At least one unit is required.")
            raise exceptions.ValidationError({u: error for u in units})


class TimeCategory(Model):
    name = CharField(max_length=32)
    user: ForeignKey[User] = ForeignKey(
        User, blank=False, null=False, on_delete=CASCADE, related_name="time_categories"
    )
    recipes: ManyToManyField[Recipe, TimeCategory] = ManyToManyField(
        Recipe, through="Time", related_name="time_categories"
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["name", "user"],
                name="recipes_time_category_unique_name_user",
            )
        ]

    def __str__(self) -> str:
        return self.name


class Equipment(Model):
    description = CharField(max_length=256)
    recipes: ManyToManyField[Recipe, Equipment] = ManyToManyField(
        Recipe, related_name="equipment"
    )
    user: ForeignKey[User] = ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=CASCADE,
        related_name="equipment",
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["description", "user"],
                name="recipes_equipment_unique_description_user",
            )
        ]

    def __str__(self) -> str:
        return self.description


class Brand(Model):
    name = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=CASCADE,
        related_name="brands",
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["name", "user"],
                name="recipes_brands_unique_name_user",
            )
        ]

    def __str__(self) -> str:
        return self.name


class Food(Model):
    name = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=CASCADE,
        related_name="food",
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["name", "user"],
                name="recipes_food_unique_name_user",
            )
        ]

    def __str__(self) -> str:
        return self.name


class Unit(Model):
    name = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=CASCADE,
        related_name="units",
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["name", "user"],
                name="recipes_unit_unique_name_user",
            )
        ]

    def __str__(self) -> str:
        return self.name


class Ingredient(Model):
    amount = CharField(blank=True, max_length=16)
    brand: ForeignKey[Brand | None] = ForeignKey(
        Brand,
        blank=True,
        null=True,
        on_delete=SET_NULL,
        related_name="ingredients",
    )
    food: ForeignKey[Food] = ForeignKey(
        Food, on_delete=CASCADE, related_name="ingredients"
    )
    order = PositiveIntegerField(default=0)
    recipe: ForeignKey[Recipe] = ForeignKey(
        Recipe, on_delete=CASCADE, related_name="ingredients"
    )
    unit: ForeignKey[Unit | None] = ForeignKey(
        Unit,
        blank=True,
        null=True,
        on_delete=SET_NULL,
        related_name="ingredients",
    )

    def __str__(self) -> str:
        return " ".join(
            a
            for a in [
                self.amount,
                self.unit.name if self.unit else None,
                self.brand.name if self.brand else None,
                self.food.name if self.food else None,
            ]
            if a
        )
