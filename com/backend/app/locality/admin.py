from django.contrib import admin

from .models import Locality, Nationality, Province

@admin.register(Province, Locality, Nationality)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('id','name')
