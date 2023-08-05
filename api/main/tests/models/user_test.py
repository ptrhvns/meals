from main.tests.factories import UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        assert str(user) == user.username
