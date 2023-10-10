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
        fields =  ['tag', 'availability_state', 'progress_state', 'opponent', 'description']
        read_only_fields = ['id', 'time_stamp', 'client']

class RequestConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestConsultation
        fields = '__all__'

class RequestConsultationAceptedSerializer(serializers.ModelSerializer):
    destiny_panel = serializers.IntegerField()
    class Meta:
        model = RequestConsultation
        fields = ['destiny_panel',]

class RequestConsultationRejectedSerializer(serializers.ModelSerializer):
    destiny_panel = serializers.IntegerField()
    class Meta:
        model = RequestConsultation
        fields = ['destiny_panel',]
