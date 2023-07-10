from Consultation.models import Consultation
from rest_framework import serializers
from Clients.api.serializers import ClientSerializer

class ConsultationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Consultation
    fields = '__all__'
