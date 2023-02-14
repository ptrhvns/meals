from __future__ import annotations

from django.core import exceptions
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Deferrable  # type: ignore[attr-defined]
from django.db.models import (
    CASCADE,
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
from django.utils.translation import gettext_lazy as _

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
    recipes: ManyToManyField[Recipe, "Tag"] = ManyToManyField(
        Recipe, related_name="tags"
    )
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
    time_category: ForeignKey["TimeCategory"] = ForeignKey(
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
            error = _("At least one unit is required.")
            raise exceptions.ValidationError({u: error for u in units})


class TimeCategory(Model):
    name = CharField(max_length=32)
    user: ForeignKey[User] = ForeignKey(
        User, blank=False, null=False, on_delete=CASCADE, related_name="time_categories"
    )
    recipes: ManyToManyField[Recipe, "TimeCategory"] = ManyToManyField(
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
