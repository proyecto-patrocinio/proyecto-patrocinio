from django.contrib import admin
from Clients.models import *
from BoardUSer.models import *


# Register your models here.
admin.site.register(Client)
admin.site.register(Patrimony)
admin.site.register(Family)
admin.site.register(Son)
admin.site.register(Tel)
admin.site.register(BoardUser)