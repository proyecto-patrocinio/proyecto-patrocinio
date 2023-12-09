import os
import logging

from allauth.account.utils import send_email_confirmation
from allauth.account.models import EmailAddress
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.auth.models import User

from Board.models import Board
from BoardUSer.models import BoardUser


logger = logging.getLogger(__name__)


def send_email_rejected_request(board, consultation):
    try:
        # Get user of board
        boardusers = BoardUser.objects.filter(board=board).all()
        boardusers_emails = [BoardUser.user.email for BoardUser in boardusers]

        # Get Case Taker user
        case_taker_users = User.objects.all().filter(groups__name="case_taker")
        case_taker_emails = [ case_taker.email for case_taker in case_taker_users ]

        emails = list(set(boardusers_emails + case_taker_emails))

        subject = f'A consultation request was rejected for "{board}" commission.'
        message = 'A Request Consultation was rejected'
        from_email = os.environ.get('EMAIL_HOST_USER','')
        recipient_list = emails

        # Render template
        html_message = render_to_string('notifications/request_rejected.html', context={'board': board, 'consultation': consultation})

        send_mail(subject, message, from_email=from_email, recipient_list=recipient_list, fail_silently=False, html_message=html_message)
    except Exception as error:
        logger.error("Error while trying to send 'Rejected Request' notification email:", str(error))
