from Consultation.models import Consultation, RequestConsultation
from rest_framework import serializers
from Card.api.serializers import CardSerializer

class ConsultationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ['id', 'state']


class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'


class RequestConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestConsultation
        fields = '__all__'

class RequestConsultationAceptedSerializer(serializers.ModelSerializer):
    destiny_panel = serializers.IntegerField()
    class Meta:
        model = RequestConsultation
        fields = ['destiny_panel',]