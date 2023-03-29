from __future__ import annotations

from django.db.models import Deferrable  # type: ignore[attr-defined]
from django.db.models import CASCADE, CharField, ForeignKey, Model, UniqueConstraint

from main.models.user import User


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
                name="units_unique_name_user",
            )
        ]
        db_table = "units"

    def __str__(self) -> str:
        return self.name
