from Consultation.models import Consultation, RequestConsultation
from rest_framework import serializers


class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'


class RequestConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestConsultation
        fields = '__all__'