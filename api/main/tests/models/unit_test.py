from main.tests.factories import UnitFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        unit = UnitFactory.build(user=user)
        assert str(unit) == unit.name
