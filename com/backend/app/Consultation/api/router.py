from Consultation.api.views import ConsultationViewSet, RequestConsultationViewSet
from rest_framework import routers

router_consultation = routers.DefaultRouter()

router_consultation.register('consultation', viewset=ConsultationViewSet, basename='consultation')
router_consultation.register('request_consultation', viewset=RequestConsultationViewSet, basename='request_consultation')
