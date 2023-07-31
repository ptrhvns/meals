from __future__ import annotations

from django.db.models import (  # type: ignore[attr-defined]
    CASCADE,
    SET_NULL,
    CharField,
    DecimalField,
    Deferrable,
    ForeignKey,
    Model,
    PositiveIntegerField,
    UniqueConstraint,
)

from main.models.brand import Brand
from main.models.food import Food
from main.models.recipe import Recipe
from main.models.unit import Unit


class Ingredient(Model):
    amount = DecimalField(decimal_places=2, max_digits=5, null=True)
    brand: ForeignKey[Brand | None] = ForeignKey(
        Brand,
        null=True,
        on_delete=SET_NULL,
        related_name="ingredients",
    )
    food: ForeignKey[Food] = ForeignKey(
        Food, on_delete=CASCADE, related_name="ingredients"
    )
    note = CharField(blank=True, default="", max_length=32)
    order = PositiveIntegerField(default=0)
    recipe: ForeignKey[Recipe] = ForeignKey(
        Recipe, on_delete=CASCADE, related_name="ingredients"
    )
    unit: ForeignKey[Unit | None] = ForeignKey(
        Unit,
        null=True,
        on_delete=SET_NULL,
        related_name="ingredients",
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["order", "recipe"],
                name="ingredients_unique_order_recipe",
            )
        ]
        db_table = "ingredients"

    def __str__(self) -> str:
        return " ".join(
            a
            for a in [
                str(self.amount),
                self.unit.name if self.unit else None,
                self.brand.name if self.brand else None,
                self.food.name if self.food else None,
            ]
            if a
        )
