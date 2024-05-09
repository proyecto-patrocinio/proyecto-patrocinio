from django.contrib import admin
from BoardUser.models import BoardUser


@admin.register(BoardUser)
class BoardUserAdmin(admin.ModelAdmin):
    autocomplete_fields = ['user', 'board']
