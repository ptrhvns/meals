from main.tests.factories import BrandFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        brand = BrandFactory.build(user=user)
        assert str(brand) == brand.name
