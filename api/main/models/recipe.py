from __future__ import annotations

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import (
    CASCADE,
    CharField,
    DecimalField,
    ForeignKey,
    Model,
    PositiveSmallIntegerField,
    TextField,
)

from main.models.user import User


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

    class Meta:
        db_table = "recipes"

    def __str__(self) -> str:
        return self.title
