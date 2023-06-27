from typing import Any

from factory import LazyAttribute, Sequence, post_generation  # type: ignore[import]
from factory.django import DjangoModelFactory  # type: ignore[import]

from main.models.brand import Brand
from main.models.user import User


class BrandFactory(DjangoModelFactory):  # type: ignore[misc]
    class Meta:
        model = Brand

    name = Sequence(lambda n: f"Brand{n + 1}")


# XXX: consider using main.models.User.create_user() instead.
class UserFactory(DjangoModelFactory):  # type: ignore[misc]
    class Meta:
        model = User

    email = LazyAttribute(lambda u: f"{u.username}@example.com")
    is_active = True
    username = Sequence(lambda n: f"user{n + 1}")

    @post_generation  # type: ignore[misc]
    def password(obj: Any, create, extracted, **kwargs):  # type: ignore[no-untyped-def] # noqa: N805
        if extracted:
            obj.set_password(extracted)
