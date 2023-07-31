from rest_framework import viewsets
from django.db.models import Prefetch
from Consultation.api.serializers import (
    ConsultationSerializer,
    RequestConsultationSerializer,
)
from Consultation.models import Consultation,  RequestConsultation
from rest_framework.response import Response


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def list(self, request, *args, **kwargs):

        if 'filter' in request.GET:
            filter_string = request.GET['filter']
            if filter_string == "card__isnull,true":
                consultations = Consultation.objects.prefetch_related(
                    Prefetch('card')
                ).filter(card__isnull=True)
                serializer = ConsultationSerializer(consultations, many=True)
                return Response(serializer.data)
        return super().list(request, *args, **kwargs)


class RequestConsultationViewSet(viewsets.ModelViewSet):
    queryset = RequestConsultation.objects.all()
    serializer_class = RequestConsultationSerializer
