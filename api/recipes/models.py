from django.db.models import CASCADE, CharField, ForeignKey, Model

from accounts.models import User


class Recipe(Model):
    title = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(User, on_delete=CASCADE, related_name="recipes")

    def __str__(self) -> str:
        return self.title
