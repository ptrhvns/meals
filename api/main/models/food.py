from __future__ import annotations

from django.db.models import Deferrable  # type: ignore[attr-defined]
from django.db.models import CASCADE, CharField, ForeignKey, Model, UniqueConstraint

from main.models.user import User


class Food(Model):
    name = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(User, on_delete=CASCADE, related_name="food")

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["name", "user"],
                name="food_unique_name_user",
            )
        ]
        db_table = "food"

    def __str__(self) -> str:
        return self.name
