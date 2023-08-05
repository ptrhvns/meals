from main.tests.factories import EquipmentFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        equipment = EquipmentFactory.build(user=user)
        assert str(equipment) == equipment.description
