import logging
from typing import Any, cast

from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError as DValidationError
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import ValidationError as DRFValidationError

from accounts.models import User

logger = logging.getLogger(__name__)


class SignupSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def validate_password(self, value: str) -> str:
        try:
            user = self.instance or User(**self.initial_data)
            password_validation.validate_password(value, user)
        except DValidationError as error:
            raise DRFValidationError(error.messages)

        return value

    def create(self, validated_data: Any) -> User:
        user = User.objects.create_user(  # type: ignore[attr-defined]
            validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        logger.info("created new user with ID %(user_id)s", {"user_id": user.id})
        return cast(User, user)
