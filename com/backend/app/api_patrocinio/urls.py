"""api_patrocinio URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from locality.api.router import router_locality
from Clients.api.router import router_clients
from Card.api.router import router_card
from User.views import get_user_info_from_token
from BoardUSer.api.router import router_boardUser
from Panel.api.router import router_panel
from Board.api.router import router_board
from Comment.api.router import router_comment
from Consultation.api.router import router_consultation
from Calendar.api.router import router_calendar
from dj_rest_auth.registration.views import RegisterView, ConfirmEmailView, VerifyEmailView, ResendEmailVerificationView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from terms_and_policies.router import paths_terms_and_policies

# from allauth.account.adapter import get_adapter
# from allauth.account.utils import complete_signup, send_email_confirmation
# from allauth.account.views import ConfirmEmailView
# from allauth.account.models import EmailAddress
# from allauth.socialaccount import signals
# from allauth.socialaccount.adapter import get_adapter as get_social_adapter
# from allauth.socialaccount.models import SocialAccount
# from django.conf import settings
# from django.utils.decorators import method_decorator
# from django.utils.translation import gettext_lazy as _
# from django.views.decorators.debug import sensitive_post_parameters
# from rest_framework import status
# from rest_framework.exceptions import MethodNotAllowed, NotFound, ValidationError
# from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.response import Response
# from rest_framework.views import APIView

# from dj_rest_auth.models import TokenModel
# from dj_rest_auth.registration.serializers import (
#     SocialAccountSerializer, SocialConnectSerializer, SocialLoginSerializer,
#     VerifyEmailSerializer, ResendEmailVerificationSerializer
# )
# from dj_rest_auth.utils import jwt_encode
# from dj_rest_auth.views import LoginView


# from django.core.mail import send_mail
# from django.template.loader import render_to_string
# import os

# def enviar_correo_personalizado(request, email):
#     subject = 'Asunto del Correo Electrónico'
#     message = 'Este es el mensaje de texto plano del correo.'
#     from_email = os.environ.get('EMAIL_HOST_USER','')
#     recipient_list = [email]  # Lista de direcciones de correo de los destinatarios

#     # Renderiza la plantilla de correo electrónico
#     html_message = render_to_string('email/custom_email.html', context={'context_variable': 'Valor personalizado'})

#     send_mail(subject, message, from_email=from_email, recipient_list=recipient_list, fail_silently=False, html_message=html_message)

# class ResendEmailVerificationView(CreateAPIView):
#     permission_classes = (AllowAny,)
#     serializer_class = ResendEmailVerificationSerializer
#     queryset = EmailAddress.objects.all()

#     def create(self, request, *args, **kwargs):
#         print("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         email = EmailAddress.objects.filter(**serializer.validated_data).first()
#         if email and not email.verified:
#             from django.contrib.sites.models import Site
#             site = Site.objects.get_current()
#             from django.conf import settings
#             settings.SITE_ID = '1'
#             print("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", site)
#             print("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", settings.SITE_ID)
#             enviar_correo_personalizado(request, email)

#         return Response({'detail': _('ok')}, status=status.HTTP_200_OK)

urlpatterns = [
    path('api/auth/account-confirm-email/<str:key>/', ConfirmEmailView.as_view()),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/verify-email/', VerifyEmailView.as_view(), name='rest_verify_email'),
    path('api/auth/confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    re_path(r'^api/auth/account-confirm-email/(?P<key>[-:\w]+)/$', VerifyEmailView.as_view(), name='account_confirm_email'),
    path('api/auth/resend-email/', ResendEmailVerificationView.as_view(), name='resend-email-verification'),
    path('api/auth/password/reset/', PasswordResetView.as_view()),
    path('api/auth/password/reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('admin/', admin.site.urls),
    path('api/clients/', include(router_clients.urls)),
    path('api/panels/', include(router_panel.urls)),
    path('api/geography/', include(router_locality.urls)),
    path('api/cards/', include(router_card.urls)),
    path('api/boardUser/', include(router_boardUser.urls)),
    path('api/boards/', include(router_board.urls)),
    path('api/consultations/', include(router_consultation.urls)),
    path('api/calendars/', include(router_calendar.urls)),
    path('api/comments/', include(router_comment.urls)),
    path('api/auth/user-by-token/', get_user_info_from_token, name='get_user_info'),
    *paths_terms_and_policies,
]
