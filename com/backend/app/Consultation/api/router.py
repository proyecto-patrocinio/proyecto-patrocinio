from Consultation.api.views import ConsultationViewSet
from rest_framework import routers

router_consultation = routers.DefaultRouter()

router_consultation.register('consultation', viewset=ConsultationViewSet, basename='consultation')
