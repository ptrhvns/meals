from django.db.models import CASCADE, CharField, DateTimeField, ForeignKey, Model

from main.lib.tokens import build_token
from main.models.user import User


class EmailConfirmationToken(Model):
    expiration = DateTimeField()
    token = CharField(max_length=256, default=build_token, unique=True)
    user: ForeignKey[User] = ForeignKey(
        User, on_delete=CASCADE, related_name="email_confirmation_tokens"
    )

    class Meta:
        db_table = "email_confirmation_tokens"

    def __str__(self) -> str:
        return self.token
