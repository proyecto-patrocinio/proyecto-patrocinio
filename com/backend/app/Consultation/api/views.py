from rest_framework import viewsets
from Consultation.api.serializers import ConsultationSerializer, RequestConsultationSerializer
from Consultation.models import Consultation,  RequestConsultation

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

class RequestConsultationViewSet(viewsets.ModelViewSet):
    queryset =  RequestConsultation.objects.all()
    serializer_class = RequestConsultationSerializer