from __future__ import annotations

from django.db.models import Deferrable  # type: ignore[attr-defined]
from django.db.models import (
    CASCADE,
    CharField,
    ForeignKey,
    ManyToManyField,
    Model,
    UniqueConstraint,
)

from main.models.recipe import Recipe
from main.models.user import User


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
                name="time_categories_unique_name_user",
            )
        ]
        db_table = "time_categories"

    def __str__(self) -> str:
        return self.name
