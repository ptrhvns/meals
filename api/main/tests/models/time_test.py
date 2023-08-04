import pytest
from django.core.exceptions import ValidationError

from main.tests.factories import (
    RecipeFactory,
    TimeCategoryFactory,
    TimeFactory,
    UserFactory,
)


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build(id=1)
        recipe = RecipeFactory.build(id=1, user=user)
        time_category = TimeCategoryFactory.build(user=user, name="cook")
        time = TimeFactory.build(
            days=1,
            hours=1,
            minutes=1,
            note="This is a note.",
            recipe=recipe,
            time_category=time_category,
        )
        assert str(time) == "cook 1d 1h 1m"


class TestCleanMethod:
    def test_fails_validation_when_all_units(self) -> None:
        user = UserFactory.build(id=1)
        recipe = RecipeFactory.build(id=1, user=user)
        time_category = TimeCategoryFactory.build(user=user, name="cook")
        time = TimeFactory.build(
            days=None,
            hours=None,
            minutes=None,
            note="This is a note.",
            recipe=recipe,
            time_category=time_category,
        )
        with pytest.raises(ValidationError):
            time.clean()

    def test_passes_validation_when_a_unit_present(self) -> None:
        user = UserFactory.build(id=1)
        recipe = RecipeFactory.build(id=1, user=user)
        time_category = TimeCategoryFactory.build(user=user, name="cook")
        time = TimeFactory.build(
            minutes=20,
            note="This is a note.",
            recipe=recipe,
            time_category=time_category,
        )
        try:
            time.clean()
        except ValidationError:
            pytest.fail("Unexpected ValidationError")
