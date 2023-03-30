from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db.models import BooleanField, CharField, DateTimeField, EmailField
from django.utils.translation import gettext_lazy


class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()

    email = EmailField(gettext_lazy("email address"))
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

    class Meta:
        db_table = "users"

    def __str__(self) -> str:
        return self.username
