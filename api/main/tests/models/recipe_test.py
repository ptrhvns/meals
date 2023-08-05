from main.tests.factories import RecipeFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        brand = RecipeFactory.build(user=user)
        assert str(brand) == brand.title
