from smtplib import SMTPException

import pytest
from django.conf import settings
from django.core import mail
from pytest_mock import MockerFixture

from main.models.user import User
from main.tasks.send_signup_confirmation import do_send_signup_confirmation
from main.tests.factories import UserFactory


@pytest.mark.django_db()
def test_sent_email_successfully() -> None:
    email = "smith@example.com"
    confirmation_url = "http://example.com/confirmation/"
    site_url = "http://example.com/"
    user = UserFactory.create(email=email)
    do_send_signup_confirmation(user.id, site_url, confirmation_url)
    assert settings.EMAIL_ADDRESSES["support"] == mail.outbox[0].from_email
    assert [email] == mail.outbox[0].to
    assert confirmation_url in str(mail.outbox[0].message())


def test_user_does_not_exist(mocker: MockerFixture) -> None:
    mocker.patch(
        "main.tasks.send_signup_confirmation.User.objects.get",
        autospec=True,
        side_effect=User.DoesNotExist,
    )
    error_mock = mocker.patch("main.tasks.send_signup_confirmation.logger.error")
    do_send_signup_confirmation(1, "https://example.com", "https://example.com")
    assert error_mock.called
    assert not mail.outbox


def test_email_delivery_fails(mocker: MockerFixture) -> None:
    user = UserFactory.build(id=1)
    mocker.patch.object(user, "email_user", side_effect=SMTPException)
    mocker.patch(
        "main.tasks.send_signup_confirmation.User.objects.get",
        autospec=True,
        return_value=user,
    )
    error_mock = mocker.patch("main.tasks.send_signup_confirmation.logger.error")
    do_send_signup_confirmation(user.id, "https://example.com", "https://example.com")
    assert error_mock.called
