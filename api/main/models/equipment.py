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


class Equipment(Model):
    description = CharField(max_length=256)
    recipes: ManyToManyField[Recipe, Equipment] = ManyToManyField(
        Recipe, related_name="equipment"
    )
    user: ForeignKey[User] = ForeignKey(
        User, on_delete=CASCADE, related_name="equipment"
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["description", "user"],
                name="equipment_unique_description_user",
            )
        ]
        db_table = "equipment"

    def __str__(self) -> str:
        return self.description
