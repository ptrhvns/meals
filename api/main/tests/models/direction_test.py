from main.models.direction import MAX_STR_LENGTH
from main.tests.factories import DirectionFactory, RecipeFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        recipe = RecipeFactory.build(user=user)
        direction = DirectionFactory.build(recipe=recipe)
        assert str(direction) == direction.description

    def test_returns_truncated_string_when_too_long(self) -> None:
        user = UserFactory.build()
        recipe = RecipeFactory.build(user=user)
        direction = DirectionFactory.build(
            recipe=recipe, description="x" * (MAX_STR_LENGTH + 20)
        )
        ellipsis_length = 3
        assert len(str(direction)) == MAX_STR_LENGTH + ellipsis_length
