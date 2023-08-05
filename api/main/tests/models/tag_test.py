from main.tests.factories import TagFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        tag = TagFactory.build(user=user)
        assert str(tag) == tag.name
