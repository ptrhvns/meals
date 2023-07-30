from __future__ import annotations

from django.db.models import (
    CASCADE,
    CharField,
    Deferrable,  # type: ignore[attr-defined]
    ForeignKey,
    ManyToManyField,
    Model,
    UniqueConstraint,
)

from main.models.recipe import Recipe
from main.models.user import User


class Tag(Model):
    name = CharField(max_length=256)
    recipes: ManyToManyField[Recipe, Tag] = ManyToManyField(Recipe, related_name="tags")
    user: ForeignKey[User] = ForeignKey(User, on_delete=CASCADE, related_name="tags")

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["name", "user"],
                name="tags_unique_name_user",
            )
        ]
        db_table = "tags"

    def __str__(self) -> str:
        return self.name
