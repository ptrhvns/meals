from smtplib import SMTPException

import celery
from celery.utils import log
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.translation import gettext as _

from main.models.user import User

logger = log.get_logger(__name__)


@celery.shared_task
def send_signup_confirmation(
    user_id: int, site_url: str, confirmation_url: str
) -> None:
    return do_send_signup_confirmation(
        user_id, site_url, confirmation_url
    )  # pragma: no cover


def do_send_signup_confirmation(
    user_id: int, site_url: str, confirmation_url: str
) -> None:
    logger.info(
        "attempting to send signup confirmation email to user ID %(user_id)s",
        {"user_id": user_id},
    )

    context = {
        "confirmation_url": confirmation_url,
        "site_title": settings.SITE_TITLE,
        "site_url": site_url,
    }

    message = render_to_string("main/email/signup_confirmation.txt", context=context)

    html_message = render_to_string(
        "main/email/signup_confirmation.html", context=context
    )

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        logger.error(
            "user ID %(user_id)s does not exist in database",
            {"user_id": user_id},
        )
        return

    try:
        user.email_user(
            _(f"Signup confirmation for {settings.SITE_TITLE}."),
            message,
            fail_silently=False,
            from_email=settings.EMAIL_ADDRESSES["support"],
            html_message=html_message,
        )
    except SMTPException:
        logger.error(
            "failed to deliver email to user ID %(user_id)s", {"user_id": user_id}
        )
        return

    logger.info(
        "successfully sent signup confirmation email to user with ID %(user_id)s",
        {"user_id": user_id},
    )
