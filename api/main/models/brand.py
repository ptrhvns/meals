from __future__ import annotations

from django.db.models import Deferrable  # type: ignore[attr-defined]
from django.db.models import CASCADE, CharField, ForeignKey, Model, UniqueConstraint

from main.models.user import User


class Brand(Model):
    name = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(User, on_delete=CASCADE, related_name="brands")

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["name", "user"],
                name="brands_unique_name_user",
            )
        ]
        db_table = "brands"

    def __str__(self) -> str:
        return self.name
