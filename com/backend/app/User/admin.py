from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
try:
    from rest_framework.authtoken.models import TokenProxy as DRFToken
except ImportError:
    from rest_framework.authtoken.models import Token as DRFToken

admin.site.unregister(DRFToken)
UserAdmin.search_fields = ('username',)
