from main.tests.factories import FoodFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        food = FoodFactory.build(user=user)
        assert str(food) == food.name
