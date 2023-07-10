from rest_framework import viewsets
from Consultation.api.serializers import ConsultationSerializer
from Consultation.models import Consultation

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
