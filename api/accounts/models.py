from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db.models import (
    CASCADE,
    BooleanField,
    CharField,
    DateTimeField,
    EmailField,
    ForeignKey,
    Model,
)
from django.utils.translation import gettext_lazy

from accounts.utils import build_token


class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()

    email = EmailField(gettext_lazy("email address"), blank=False)
    email_confirmed_datetime = DateTimeField(blank=True, null=True)
    is_active = BooleanField(
        gettext_lazy("active"),
        default=False,
        help_text=gettext_lazy(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    username = CharField(
        gettext_lazy("username"),
        error_messages={"unique": gettext_lazy("That username already exists.")},
        help_text=gettext_lazy("At most 150 characters. Letters, numbers, @/./+/-/_."),
        max_length=150,
        unique=True,
        validators=[username_validator],
    )

    def __str__(self) -> str:
        return self.username


class EmailConfirmationToken(Model):
    expiration = DateTimeField()
    token = CharField(max_length=256, default=build_token, unique=True)
    user: ForeignKey[User] = ForeignKey(
        User, on_delete=CASCADE, related_name="email_confirmation_tokens"
    )

    def __str__(self) -> str:
        return self.token
