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
from BoardUSer.models import BoardUser


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def send_email_accepted_request(board, consultation):
    try:
        boardusers = BoardUser.objects.filter(board=board).all()
        emails = [BoardUser.user.email for BoardUser in boardusers]

        subject = f'A consultation request was accepted for "{board}" commission.'
        message = 'A Request Consultation was accepted'
        from_email = os.environ.get('EMAIL_HOST_USER','')
        recipient_list = emails

        # Render template
        html_message = render_to_string('notifications/request_accepted.html', context={'board': board, 'consultation': consultation})

        send_mail(subject, message, from_email=from_email, recipient_list=recipient_list, fail_silently=False, html_message=html_message)
    except Exception as error:
        logger.error("Error while trying to send 'Accepted Request' notification email:", str(error))
