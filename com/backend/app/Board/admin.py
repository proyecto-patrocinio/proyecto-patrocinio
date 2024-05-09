from django.contrib import admin
from Board.models import Board


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    search_fields = ['title']
