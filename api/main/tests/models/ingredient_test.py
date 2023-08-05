from main.tests.factories import (
    BrandFactory,
    FoodFactory,
    IngredientFactory,
    RecipeFactory,
    UnitFactory,
    UserFactory,
)


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        ingredient = IngredientFactory.build(
            amount=1,
            brand=BrandFactory.build(name="Acme", user=user),
            food=FoodFactory.build(name="apple", user=user),
            recipe=RecipeFactory.build(user=user),
            unit=UnitFactory.build(name="slice", user=user),
        )
        assert str(ingredient) == "1 slice Acme apple"
