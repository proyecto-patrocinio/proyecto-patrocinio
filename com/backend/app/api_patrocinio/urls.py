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
from user.api.router import router_user
from Clients.api.router import router_clients
from Panel.api.router import router_panel
from dj_rest_auth.registration.views import RegisterView, ConfirmEmailView, VerifyEmailView, ResendEmailVerificationView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

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
    path('api/users/', include(router_user.urls)),
    path('admin/', admin.site.urls),
    path('api/clients/', include(router_clients.urls)),
    path('api/panel/', include(router_panel.urls)),
    path('api/geography/', include(router_locality.urls)),
    
]
