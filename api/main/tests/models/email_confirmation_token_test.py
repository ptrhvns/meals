from main.tests.factories import EmailConfirmationTokenFactory, UserFactory


class TestDunderStrMethod:
    def test_returns_correctly_formatted_string(self) -> None:
        user = UserFactory.build()
        email_confirmation_token = EmailConfirmationTokenFactory.build(user=user)
        assert str(email_confirmation_token) == email_confirmation_token.token
