from __future__ import annotations

from typing import Final

from django.db.models import (  # type: ignore[attr-defined]
    CASCADE,
    Deferrable,
    ForeignKey,
    Model,
    PositiveIntegerField,
    TextField,
    UniqueConstraint,
)

from main.models.recipe import Recipe

MAX_STR_LENGTH: Final = 25


class Direction(Model):
    description = TextField()
    order = PositiveIntegerField(default=0)
    recipe: ForeignKey[Recipe] = ForeignKey(
        Recipe, on_delete=CASCADE, related_name="directions"
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["order", "recipe"],
                name="directions_unique_order_recipe",
            )
        ]
        db_table = "directions"

    def __str__(self) -> str:
        if len(self.description) > MAX_STR_LENGTH:
            return f"{self.description[:MAX_STR_LENGTH]}..."

        return self.description
