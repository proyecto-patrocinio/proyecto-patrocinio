from django.contrib import admin
from Clients.models import *

class ClientAdmin(admin.ModelAdmin):
    list_display = ['idclient', 'postal']
# Register your models here.
admin.site.register(Client, ClientAdmin)
admin.site.register(Patrimony)
admin.site.register(Family)
admin.site.register(Son)
admin.site.register(Tel)
