from __future__ import annotations

from django.db.models import CASCADE, CharField, ForeignKey, ManyToManyField, Model

from accounts.models import User


class Recipe(Model):
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
        unique_together = ["name", "user"]

    def __str__(self) -> str:
        return self.name
