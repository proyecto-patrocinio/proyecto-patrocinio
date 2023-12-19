import os
import logging

from allauth.account.utils import send_email_confirmation
from allauth.account.models import EmailAddress
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from django.core.mail import send_mail
from django.template.loader import render_to_string

from Board.models import Board
from BoardUser.models import BoardUser


logger = logging.getLogger(__name__)


def send_email_new_request(board):
    try:
        boardusers = BoardUser.objects.filter(board=board).all()
        emails = [BoardUser.user.email for BoardUser in boardusers]

        subject = f'New consultation request for the "{board}" commission.'
        message = 'New Request Consultation!'
        from_email = os.environ.get('EMAIL_HOST_USER','')
        recipient_list = emails

        # Render template
        html_message = render_to_string('notifications/new_request.html', context={'board': board})

        send_mail(subject, message, from_email=from_email, recipient_list=recipient_list, fail_silently=False, html_message=html_message)
    except Exception as error:
        logger.error("Error while trying to send 'New Request' notification email:", str(error))
