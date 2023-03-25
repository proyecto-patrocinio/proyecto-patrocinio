from Clients.views import proof, pocket
from django.urls import path


urlpatterns = [
    path('prueba/', proof),
    path('pocket/', pocket)
]