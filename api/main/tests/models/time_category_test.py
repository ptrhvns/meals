from main.tests.factories import TimeCategoryFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        time_category = TimeCategoryFactory.build(user=user)
        assert str(time_category) == time_category.name
