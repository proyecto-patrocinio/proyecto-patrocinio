from Consultation.models import Consultation, RequestConsultation
from rest_framework import serializers

class ConsultationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ['id', 'availability_state', 'progress_state']


class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'

class ConsultationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields =  '__all__'
        read_only_fields = ['id', 'time_stamp', 'client']

class RequestConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestConsultation
        fields = '__all__'

class ConsultationAceptedSerializer(serializers.ModelSerializer):
    destiny_panel = serializers.IntegerField()  # Destiny panel*
    class Meta:
        model = RequestConsultation
        fields = ['destiny_panel']

class ConsultationRejectedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestConsultation
        fields = []
