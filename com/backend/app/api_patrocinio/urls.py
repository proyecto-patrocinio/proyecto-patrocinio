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
