from Consultation.models import Consultation, RequestConsultation
from rest_framework import serializers
from Clients.api.serializers import ClientSerializer

class ConsultationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Consultation
    fields = '__all__'

class RequestConsultationSerializer(serializers.ModelSerializer):
  class Meta:
    model = RequestConsultation
    fields = '__all__'