from main.tests.factories import DirectionFactory, RecipeFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        recipe = RecipeFactory.build(user=user)
        direction = DirectionFactory.build(recipe=recipe)
        assert str(direction) == direction.description
